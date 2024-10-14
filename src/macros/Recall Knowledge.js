const actor = canvas.tokens.controlled[0].actor;
const targets = game.user.targets;

const training_ranks = ["U", "T", "E", "M", "L"];

const has_lore = await Dialog.wait({
  title: "Applicable Lore?",
  content: "Do you have a lore skill that applies to this creature?",
  buttons: {
    yes: {
      label: "Yes",
      callback: () => true,
    },
    no: {
      label: "No",
      callback: () => false,
    },
  },
  default: "no",
});

if (has_lore) {
  const lores = Object.values(actor.skills)
    .filter((s) => s.lore === true)
    .map((l) => ({
      label: `<b>${training_ranks[l.rank]}</b> ${l.label}`,
      callback: () => l.slug,
    }));
  if (Object.keys(lores).length <= 0) {
    Dialog.prompt({ title: "You have no lore skills" });
    return;
  }
  const selected_lore = await Dialog.wait({
    title: "Select Lore",
    content: "Which lore are you using to recall knowledge?",
    buttons: lores,
  });
  for (const target of targets) {
    const id = target.actor.identificationDCs;
    const dc = id.lore[id.lore.length - 1].dc;
    actor.skills[selected_lore].roll({ dc });
  }
} else {
  const feats = Array.from(actor.feats.values())
    .map((o) => Array.from(o.feats))
    .concat(actor.feats.bonus.feats)
    .flat(1);

  const guaranteed = [];
  if (feats.find((o) => o.feat.name === "Master Monster Hunter")) guaranteed.push("nature");

  for (const target of targets) {
    const id = target.actor.identificationDCs;
    const skills = guaranteed.concat(id.skills);
    const best_skill = skills.reduce((a, b) => (actor.skills[a].mod >= actor.skills[b].mod ? a : b));
    actor.skills[best_skill].roll({ dc: id.standard.dc });
  }
}
