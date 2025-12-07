#!/bin/bash
set -euo pipefail

# -----------------------------------------------------
# 1. Carregar variáveis de ambiente de forma segura
# -----------------------------------------------------
if [ -f .env ]; then
  echo "Carregando variáveis do .env..."
  export $(sed 's/#.*//g' .env | xargs)
else
  echo "Arquivo .env não encontrado!"
  exit 1
fi

# -----------------------------------------------------
# 2. Função para impressão colorida
# -----------------------------------------------------
green() { printf "\033[32m%s\033[0m\n" "$1"; }
red()   { printf "\033[31m%s\033[0m\n" "$1"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$1"; }

# -----------------------------------------------------
# 3. Confirmar para evitar acidentes
# -----------------------------------------------------
yellow "ATENÇÃO: você está prestes a APAGAR e RECRIAR o banco '$DB_NAME'."
read -p "Deseja continuar? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  red "Operação cancelada."
  exit 1
fi

# -----------------------------------------------------
# 4. Validar sequelize-cli
# -----------------------------------------------------
if ! command -v npx >/dev/null 2>&1; then
  red "npx não encontrado! Instale Node.js e NPM."
  exit 1
fi

if ! npx sequelize-cli --version >/dev/null 2>&1; then
  red "sequelize-cli não encontrado! Instale com: npm install --save-dev sequelize-cli"
  exit 1
fi

# -----------------------------------------------------
# 5. Testar conexão com MySQL
# -----------------------------------------------------
echo "Testando conexão com MySQL..."
if ! mysql -u"$DB_USER" -p"$DB_PWD" -h"$DB_HOST" -P"$DB_PORT" -e "SELECT 1;" >/dev/null; then
  red "ERRO: Não foi possível conectar ao banco."
  exit 1
fi
green "Conexão ok."

# -----------------------------------------------------
# 6. Drop DB
# -----------------------------------------------------
echo "Apagando o banco $DB_NAME..."
npx sequelize-cli db:drop
green "Banco apagado."

# -----------------------------------------------------
# 7. Create DB
# -----------------------------------------------------
echo "Criando o banco $DB_NAME..."
npx sequelize-cli db:create
green "Banco criado."

# -----------------------------------------------------
# 8. Executar migrations
# -----------------------------------------------------
echo "Rodando migrations..."
npx sequelize-cli db:migrate
green "Migrations executadas."

# Contar tabelas criadas (ignora header)
TOTAL_TABLES=$(mysql -sN -u"$DB_USER" -p"$DB_PWD" -h"$DB_HOST" -P"$DB_PORT" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';")
green "Total de $TOTAL_TABLES tabelas criadas."

# -----------------------------------------------------
# 9. Executar seeders
# -----------------------------------------------------
echo "Rodando seeders..."
npx sequelize-cli db:seed:all
green "Seeders executadas."

# -----------------------------------------------------
# 10. Finalização
# -----------------------------------------------------
green "✔ Instalação concluída!"
