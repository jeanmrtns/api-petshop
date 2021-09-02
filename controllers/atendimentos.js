const Atendimento = require("../models/atendimentos");

module.exports = (app) => {
  app.get("/atendimentos/all", (req, res) => {
    Atendimento.visualize(res);
  });

  app.get("/atendimentos/:id", (req, res) => {
    Atendimento.visualizeOne(req.params.id, res);
  });

  app.post("/atendimentos", (req, res) => {
    const atendimento = req.body;

    Atendimento.add(atendimento, res);
  });

  app.delete("/atendimentos/:id", (req, res) => {
    Atendimento.delete(req.params.id, res);
  });

  app.put("/atendimentos/:id", (req, res) => {
    Atendimento.update(req.params.id, req.body.novaData, res);
  });
};
