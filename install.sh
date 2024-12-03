#!/bin/bash

# Carregar as variáveis do arquivo .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Configurações
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PWD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_DIALECT=$DB_DIALECT

# Função para exibir mensagens em verde
function print_success() {
  echo -e "\e[32m$1\e[0m"
}

# 1. Apagar o banco de dados
echo "Apagando o banco de dados $DB_NAME..."
npx sequelize-cli db:drop

# 2. Criar o banco de dados
echo "Criando o banco de dados $DB_NAME..."
npx sequelize-cli db:create

# 3. Testar se o banco foi criado
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e "USE $DB_NAME"; then
  print_success "Banco $DB_NAME criado"
else
  echo "Falha ao criar o banco de dados."
  exit 1
fi

# 4. Rodar as migrations
echo "Rodando as migrations..."
npx sequelize-cli db:migrate

# Verificar se as migrations foram executadas com sucesso
MIGRATION_STATUS=$?
if [ $MIGRATION_STATUS -eq 0 ]; then
  # Consultar as tabelas criadas
  TABLES=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e "SHOW TABLES IN $DB_NAME" | wc -l)
  print_success "Total de $TABLES tabelas criadas"
else
  echo "Falha ao rodar as migrations."
  exit 1
fi

# 5. Rodar as seeders
echo "Rodando as seeders..."
npx sequelize-cli db:seed:all

# Verificar se as seeders foram executadas com sucesso
SEEDER_STATUS=$?
if [ $SEEDER_STATUS -eq 0 ]; then
  print_success "Sucesso ao executar Seeders"
else
  echo "Falha ao rodar as seeders."
  exit 1
fi

# 6. Finalizar
echo "Instalação concluída"