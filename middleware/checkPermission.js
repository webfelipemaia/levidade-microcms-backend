const db = require('../helpers/db.helper');

function checkPermission(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Não autenticado' });

      // Carrega o usuário com a role e permissões
      const user = await db.User.findByPk(userId, {
        include: {
          model: db.Role,
          include: {
            model: db.Permission,
            where: { name: permissionName },
            required: false // para permitir filtro mesmo se não tiver permissão
          }
        }
      });

      const hasPermission = user?.Role?.Permissions?.length > 0;

      if (!hasPermission) {
        return res.status(403).json({ error: 'Permissão negada' });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
}

module.exports = { checkPermission };
