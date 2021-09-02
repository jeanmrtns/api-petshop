const moment = require("moment");
const conn = require("../infra/connection");

class Atendimento {
  add(atendimento, resposta) {
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    const dataAtendimento = moment(
      atendimento.dataAtendimento,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD HH:mm:ss");

    const nomeEhValido = atendimento.cliente.length >= 5;
    const dataEhValida = moment(dataAtendimento).isSameOrAfter(dataAtual);

    const possibleErrors = [
      {
        name: "date",
        valid: dataEhValida,
        message: "A data de agendamento deve ser maior que a data atual.",
      },
      {
        name: "name",
        valid: nomeEhValido,
        message: "O nome deve conter no mínimo 5 caracteres.",
      },
    ];

    const existsErrors = possibleErrors.filter((error) => !error.valid);

    if (existsErrors.length) {
      resposta.status(400).json(existsErrors);
    } else {
      const atendimentoAtualizado = {
        ...atendimento,
        dataAtual,
        dataAtendimento,
      };
      const sql = `INSERT INTO atendimentos SET ?`;

      conn.query(sql, atendimentoAtualizado, (error, results) => {
        if (error) {
          resposta.status(400).json(error.sqlMessage);
        } else {
          resposta.status(201).json({
            ...atendimentoAtualizado,
            results,
          });
        }
      });
    }
  }

  visualize(resposta) {
    const sql = "SELECT * FROM atendimentos";

    conn.query(sql, (error, results) => {
      if (error) {
        resposta.status(400).json(error.sqlMessage);
      } else {
        const data = results.map((atendimento) => {
          return atendimento;
        });

        resposta.status(200).json(data);
      }
    });
  }

  visualizeOne(id, resposta) {
    const sql = `SELECT * FROM atendimentos WHERE id = ${id}`;

    conn.query(sql, (error, results) => {
      if (error) {
        resposta.status(400).json("Erro ao procurar usuário.");
      } else {
        if (results.length) {
          resposta.status(200).json(results);
        } else {
          resposta.status(400).json("Usuário não existe.");
        }
      }
    });
  }

  delete(id, resposta) {
    const sql = "DELETE FROM atendimentos WHERE id = " + id;

    conn.query(sql, (error, results) => {
      if (error) {
        resposta.status(400).json(error);
      } else {
        resposta.status(200).json(results);
      }
    });
  }

  update(id, novaData, resposta) {
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    const sqlNovaData = moment(novaData, "DD/MM/YYYY ").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const dataValida = moment(sqlNovaData).isSameOrAfter(dataAtual);

    if (dataValida) {
      const sql = `UPDATE atendimentos SET dataAtendimento = '${sqlNovaData}' WHERE id = ${id}`;

      conn.query(sql, (error, results) => {
        if (error) {
          resposta.status(400).json("Erro ao atualizar o atendimento.");
        } else {
          resposta.status(200).json(results);
        }
      });
    } else {
      resposta.status(400).json("A data deve ser maior do que a data atual.");
    }
  }
}

module.exports = new Atendimento();
