#!/bin/bash

# Endpoint URL
USER_URL="http://localhost:4000/users"
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

# Dados do papel
ROLE_DATA=$(cat <<EOF
{
  "name": "Admin",
  "name": "Manager",
  "name": "User",
  "name": "Guest"
}
EOF
)

# Start: verifica se o serviço está rodando na porta especificada
PORT="4000"
if netstat -tuln | grep -q ":$PORT"; then
    echo "O serviço está rodando na porta $PORT. \n\n"
    
# Faz uma solicitação GET ao endpoint de usuários
else
    echo "O serviço não está rodando na porta $PORT. \n\n"
fi


# Criar usuários
curl -X POST $USER_URL \
    -H "Content-Type: application/json" \
    -d "$USER_DATA"

# Mensagem de sucesso
echo -e "\n"
echo "Solicitação para criar usuário enviada! \n\n"

    echo "Listando usuários:"
    echo -e "\n"
    curl -X GET $USER_URL -H "Content-Type: application/json"
    echo -e "\n"

# Criar papéis
curl -X POST $ROLE_URL \
    -H "Content-Type: application/json" \
    -d "$ROLE_DATA"
echo -e "\n"

# Exibindo mensagem de sucesso
echo "Solicitação para criar role e associar permissões enviada!"

# Adicionar permissões a um papel



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