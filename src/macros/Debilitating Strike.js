const actor = canvas.tokens.controlled[0].actor;
const targets = game.user.targets;
const predicates = Object.keys(actor.rollOptions.all);

async function id2link(uuid) {
  const item = await fromUuid(uuid);
  const name = item.name;
  return `@UUID[${uuid}]{${name}}`;
}

const debil_feature = actor.items.getName("Debilitating Strike");
if (debil_feature === undefined) {
  Dialog.prompt({
    title: "Invalid Action",
    content: "Actor does not have the Debilitating Strike feature.",
  });
}

const debil = debil_feature.rules.find((rule) => rule.key === "RollOption" && rule.label === "Debilitation");

const options = debil.suboptions.filter((opt) => game.pf2e.Predicate.test(opt.predicate, predicates));
const buttons = await Promise.all(
  options.map(async (opt) => ({
    label: (await game.pf2e.TextEditor.enrichHTML(`@Localize[${opt.label}]`)) + (opt.selected ? "*" : ""),
    callback: () => opt.value,
  }))
);

const selection = await Dialog.wait({
  title: "Select Debilitation",
  content: "Which debilitation are you applying?",
  buttons: buttons,
});

await debil.toggle(selection, selection);

/*
let enduring = false;
if (game.pf2e.Predicate.test(["feat:enduring-debilitation"], predicates)) {
  enduring = await Dialog.confirm({
    title: "Enduring Debilitation",
    content: "Are you using Endurting Debilitation?"
  });
}
const effect = (await fromUuid(enduring ? "Compendium.pf2e.feat-effects.Item.PX6WdrpzEdUzKRHx" : "Compendium.pf2e.feat-effects.Item.yBTASi3FvnReAwHy")).clone();
*/

const links = [];

if (selection === "bloody") {
  const DamageRoll = CONFIG.Dice.rolls.find((r) => r.name === "DamageRoll");
  const r = await new DamageRoll("3d6[bleed]").evaluate();
  links.push(await r.render());
} else if (selection === "critical") {
  links.push(await id2link(`Actor.${actor.id}.Item.Hfej0QE9TMK5JgtJ`));
} else if (selection === "precision-damage") {
} else if (selection === "weakness") {
  const damage_type = await Dialog.wait({
    title: "Select Damage Type",
    content: "Apply weakness 5 to the selected damage type.",
    buttons: [
      { label: "bludgeoning", callback: () => "b" },
      { label: "piercing", callback: () => "p" },
      { label: "slashing", callback: () => "s" },
    ],
  });
  const effect = {
    b: "Compendium.rais-tools.effects.Item.7enhugMtLIXsJETm",
    p: "Compendium.rais-tools.effects.Item.R8bU2yVflhabDDij",
    s: "Compendium.rais-tools.effects.Item.bJZTOPlBmz24Vkoc",
  }[damage_type];
  if (effect !== null) {
    links.push(await id2link(effect));
  }
} else {
  const effect = {
    clumsy: "Compendium.rais-tools.effects.Item.MAleBa1gZ8L8Yiyz",
    enfeebled: "Compendium.rais-tools.effects.Item.bzhoEn7NXbt0cAt0",
    "off-guard": "Compendium.rais-tools.effects.Item.lPC1YRkVIveNbP1M",
    "prevent-flanking": "Compendium.rais-tools.effects.Item.KjjhbZQFNC0tdbPa",
    "prevent-reactions": "Compendium.rais-tools.effects.Item.ju92Cdq25ndSDD6m",
    "prevent-step": "Compendium.rais-tools.effects.Item.0vPlYSQumRUlz67H",
    "reduce-cover": "Compendium.rais-tools.effects.Item.mDfcEAdP2hAgo25H",
    "speed-penalty": "Compendium.rais-tools.effects.Item.czL2fSW3isNtVmz8",
    stupefied: "Compendium.rais-tools.effects.Item.s5oEnXUYn49wT3wj",
  }[selection];
  if (effect !== null) {
    links.push(await id2link(effect));
  }
}

await ChatMessage.create(
  {
    author: game.users.current,
    content: `${actor.name} applies ${selection} debilitation!\n` + links.join("\n"),
    style: CONST.CHAT_MESSAGE_STYLES.OTHER,
  },
  { chatBubble: true }
);
