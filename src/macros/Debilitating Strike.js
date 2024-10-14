const actor = canvas.tokens.controlled[0].actor;
const targets = game.user.targets;
const predicates = Object.keys(actor.rollOptions.all);

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

if (selection === "bloody") {
  const DamageRoll = CONFIG.Dice.rolls.find((r) => r.name === "DamageRoll");
  const r = await new DamageRoll("3d6[bleed]").evaluate();
  await r.toMessage();
} else if (selection === "critical") {
  const dc = actor.classDC.dc.value;
  for (const target of targets) {
    const save = await target.actor.saves.fortitude.roll({ dc });
    const effect = await fromUuid(
      {
        0: "Compendium.rais-tools.effects.Item.nI2ckmZD4slpH4w6",
        1: "Compendium.rais-tools.effects.Item.K0p1XUBwZUhIr1FG",
        2: "Compendium.rais-tools.effects.Item.TCyuF4bRQyjt5cYi",
      }[save.degreeOfSuccess]
    );
    if (effect !== null) {
      await target.actor.addToInventory(effect);
    }
  }
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
  const effect = await fromUuid(
    {
      b: "Compendium.rais-tools.effects.Item.7enhugMtLIXsJETm",
      p: "Compendium.rais-tools.effects.Item.R8bU2yVflhabDDij",
      s: "Compendium.rais-tools.effects.Item.bJZTOPlBmz24Vkoc",
    }[selection]
  );
  for (const target of targets) {
    await target.actor.addToInventory(effect);
  }
} else {
  const effect = await fromUuid(
    {
      clumsy: "Compendium.rais-tools.effects.Item.MAleBa1gZ8L8Yiyz",
      enfeebled: "Compendium.rais-tools.effects.Item.bzhoEn7NXbt0cAt0",
      "off-guard": "Compendium.rais-tools.effects.Item.lPC1YRkVIveNbP1M",
      "prevent-flanking": "Compendium.rais-tools.effects.Item.KjjhbZQFNC0tdbPa",
      "prevent-reactions": "Compendium.rais-tools.effects.Item.ju92Cdq25ndSDD6m",
      "prevent-step": "Compendium.rais-tools.effects.Item.0vPlYSQumRUlz67H",
      "reduce-cover": "Compendium.rais-tools.effects.Item.mDfcEAdP2hAgo25H",
      "speed-penalty": "Compendium.rais-tools.effects.Item.czL2fSW3isNtVmz8",
      stupefied: "Compendium.rais-tools.effects.Item.s5oEnXUYn49wT3wj",
    }[selection]
  );
  for (const target of targets) {
    await target.actor.addToInventory(effect);
  }
}
