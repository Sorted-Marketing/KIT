// Hero demo: tell KIT about a coffee and watch the dashboard update.
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('demo');
  if (!stage) return;

  const MSG = "Coffee with Graham Stoddard went well. He's hiring in Q1, follow up in January.";
  const REPLY = "Done. I've logged the coffee on Graham's record, noted he's hiring in Q1 and set a follow-up for <b>Wed 6 Jan</b>. I'll email you on the day.";
  const BASE = [
    { id: 'graham', name: 'Graham Stoddard', role: 'Head of Research', when: 'Today' },
    { id: 'frances', name: 'Frances Catherine', role: 'Window cleaner', when: 'Tomorrow' },
    { id: 'annie', name: 'Annie Emilia', role: 'Old colleague', when: 'Fri 30 Oct' },
    { id: 'liz', name: 'Elizabeth McNicol', role: 'Sister · birthday', when: 'Sun 1 Nov' }
  ];

  const $ = (id) => document.getElementById(id);
  const fus = $('demo-fus');
  const msgs = $('demo-msgs');
  const field = $('demo-field');
  const toast = $('demo-toast');
  const toastText = $('demo-toast-text');
  const done = $('demo-done');
  const playBtn = $('demo-play');
  const replayBtn = $('demo-replay');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let run = 0;
  let state = 'idle';
  let hoverTimer = null;

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function card(f, extra) {
    const c = el('div', 'fu' + (extra ? ' ' + extra : ''));
    c.dataset.id = f.id;
    c.append(el('b', '', f.name), el('span', '', f.role), el('span', '', f.when));
    return c;
  }

  function renderFollowUps(list) {
    fus.replaceChildren(...list.map((f, i) => card(f, i === 0 ? 'fu-hot' : '')));
  }

  function bump(node, value) {
    node.textContent = value;
    node.classList.add('bump');
    setTimeout(() => node.classList.remove('bump'), 250);
  }

  function showToast(text) {
    toastText.textContent = text;
    toast.hidden = false;
  }

  function wait(ms, token) {
    return new Promise((resolve, reject) => setTimeout(() => (token === run ? resolve() : reject()), reduce ? 0 : ms));
  }

  function reset() {
    run += 1;
    state = 'idle';
    renderFollowUps(BASE);
    msgs.replaceChildren(el('div', 'bub bub-kit', 'Hi Gareth. Who have you been in touch with?'));
    field.replaceChildren(el('span', 'ph', 'Message KIT'));
    done.textContent = '41';
    toast.hidden = true;
    playBtn.hidden = false;
    replayBtn.hidden = true;
  }

  async function play() {
    if (state !== 'idle') return;
    state = 'playing';
    const token = run;
    playBtn.hidden = true;

    try {
      // Gareth types his update
      if (!reduce) {
        for (let i = 1; i <= MSG.length; i++) {
          const shown = MSG.slice(0, i);
          field.replaceChildren(document.createTextNode(shown.length > 34 ? '…' + shown.slice(-34) : shown), el('span', 'caret'));
          await wait(26, token);
        }
        await wait(250, token);
      }
      field.replaceChildren(el('span', 'ph', 'Message KIT'));
      msgs.append(el('div', 'bub bub-me', MSG.replace(/&/g, '&amp;').replace(/</g, '&lt;')));

      // KIT thinks, then replies
      const typing = el('div', 'typing', '<i></i><i></i><i></i>');
      typing.setAttribute('aria-label', 'KIT is typing');
      msgs.append(typing);
      await wait(1100, token);
      typing.remove();
      msgs.append(el('div', 'bub bub-kit', REPLY));

      // The dashboard updates
      const graham = fus.querySelector('[data-id="graham"]');
      graham.classList.add('fu-flash');
      bump(done, '42');
      showToast('Coffee with Graham Stoddard logged');
      await wait(1000, token);

      const moved = BASE.filter((f) => f.id !== 'graham');
      renderFollowUps(moved);
      fus.append(card({ id: 'graham', name: 'Graham Stoddard', role: 'Head of Research', when: 'Wed 6 Jan' }, 'fu-new'));
      showToast('Follow-up with Graham set for Wed 6 Jan');
      await wait(2600, token);

      toast.hidden = true;
      state = 'done';
      replayBtn.hidden = false;
    } catch (e) {
      // a replay interrupted this run
    }
  }

  stage.addEventListener('click', (e) => {
    if (e.target.closest('#demo-replay')) return;
    play();
  });
  stage.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === stage) {
      e.preventDefault();
      play();
    }
  });
  if (fineHover) {
    stage.addEventListener('mouseenter', () => { hoverTimer = setTimeout(play, 400); });
    stage.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
  }
  replayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reset();
    setTimeout(play, 250);
  });

  reset();
});
