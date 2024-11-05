const btSerial = require("bluetooth-serial-port").BluetoothSerialPort;
const axios = require("axios");

const btSerialPort = new btSerial();
const hc05Address = "98:D3:31:F9:3F:35"; // Substitua pelo endereço do seu HC-05

// URL da API local
const apiUrl = "http://localhost:3000/sendData";

let buffer = ""; // Variável para armazenar dados temporariamente

// Tente conectar ao HC-05
btSerialPort.connect(hc05Address, 1, (err, status) => {
  if (err) {
    console.error("Erro ao conectar:", err);
    return;
  }

  console.log("Conectado ao HC-05");

  // Quando receber dados
  btSerialPort.on("data", (data) => {
    const receivedData = data.toString("utf-8").trim();
    console.log("Dados recebidos:", receivedData);

    buffer += receivedData; // Adiciona os dados ao buffer

    // Verifica se a string completa está no formato JSON
    try {
      const jsonData = JSON.parse(buffer); // Tenta analisar os dados
      // Se a análise for bem-sucedida, envie para a API
      fetchData = async () => {
        try {
          const response = await axios.post(apiUrl, jsonData);
          console.log(
            `Resposta da API: ${response.status} - ${response.statusText}`
          );
        } catch (error) {
          console.error(`Erro ao enviar dados para a API: ${error.message}`);
        }
      };
      fetchData();
      buffer = ""; // Limpa o buffer após o envio bem-sucedido
    } catch (e) {
      // Se não conseguir analisar, continue aguardando mais dados
      console.log("Aguardando dados completos...");
    }
  });

  // Tratamento de erros
  btSerialPort.on("error", (error) => {
    console.error("Erro:", error);
  });
});

// Desconectando
process.on("SIGINT", () => {
  btSerialPort.close();
  console.log("Conexão encerrada.");
  process.exit();
});
