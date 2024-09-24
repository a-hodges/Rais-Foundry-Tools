const self = game.users.current;
const token = self.getActiveTokens()[0];
if (token === undefined) {
  let d = new Dialog({
    title: "Invigorating fear error",
    content: "<p>No token selected</p>",
    buttons: {
      one: {
       icon: '<i class="fas fa-check"></i>',
       label: "Close"
      }
    },
    default: "two"
  });
  d.render(true);
} else {
  const hp = Math.max(3, ...self.targets.map(token => token.actor.level));

  const immunity = (await fromUuid("Item.xxFQX1uDfqZK3Cbm")).toObject();
  const effect = (await fromUuid("Item.sZOdS3v6Cj66vfe0")).toObject();
  effect.system.rules[0].value = hp;

  await token.actor.createEmbeddedDocuments("Item", [effect, immunity]);
}