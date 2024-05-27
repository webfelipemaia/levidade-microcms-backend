#!/bin/bash

# Endpoint URL
URL="http://localhost:4000/users"
ROLE_URL="http://localhost:4000/roles"
PERMISSION_URL="http://localhost:4000/permissions/add"
# Dados do usuário
USER_DATA=$(cat <<EOF
{
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "New",
  "lastname": "User"
}
EOF
)

echo -e "\n"
# Solicitação POST
curl -X POST $URL \
    -H "Content-Type: application/json" \
    -d "$USER_DATA"

# Mensagem de sucesso
echo -e "\n"
echo "Solicitação para criar usuário enviada!"
echo -e "\n"

# Verifica se o serviço está rodando na porta especificada
PORT="4000"
if netstat -tuln | grep -q ":$PORT"; then
    echo "O serviço está rodando na porta $PORT."
    echo -e "\n"
    # Faz uma solicitação GET ao endpoint de usuários
    echo "Listando usuários:"
    echo -e "\n"
    curl -X GET $URL -H "Content-Type: application/json"
else
    echo "O serviço não está rodando na porta $PORT."
fi
echo -e "\n"


# Fazendo a solicitação POST
curl -X POST $ROLE_URL \
    -H "Content-Type: application/json" \
    -d "$ROLE_DATA"

# Exibindo mensagem de sucesso
echo -e "\nSolicitação para criar role e associar permissões enviada!"

# Fazendo a solicitação POST para criar a role
echo -e "Criando role 'User'..."
curl -X POST $ROLE_URL \
    -H "Content-Type: application/json" \
    -d "$ROLE_USER_DATA"
echo -e "\nRole 'User' criada com sucesso!"

# Fazendo a solicitação POST para adicionar permissões à role


# Dados da role a ser criada
ROLE_DATA=$(cat <<EOF
{
  "name": "Admin"
}
EOF
)

# Lista de permissões a serem adicionadas
PERMISSIONS=("CREATE_USER" "DELETE_USER" "UPDATE_USER")

# Fazendo a solicitação POST para criar a role
echo -e "Criando role 'Admin'..."
curl -X POST $ROLE_URL \
    -H "Content-Type: application/json" \
    -d "$ROLE_DATA"
echo -e "\nRole 'Admin' criada com sucesso!"

# Fazendo a solicitação POST para adicionar permissões à role
for PERMISSION in "${PERMISSIONS[@]}"; do
    PERMISSIONS_DATA=$(cat <<EOF
{
  "roleName": "Admin",
  "permissionName": "$PERMISSION"
}
EOF
    )

    echo -e "\nAdicionando permissão '$PERMISSION' à role 'Admin'..."
    curl -X POST $PERMISSION_URL \
        -H "Content-Type: application/json" \
        -d "$PERMISSIONS_DATA"
    echo -e "\nPermissão '$PERMISSION' adicionada com sucesso à role 'Admin'!"
done