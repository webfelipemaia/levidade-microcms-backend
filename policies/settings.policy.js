const SETTINGS_POLICY = {
    PERMS: {
      READ: 'settings:read',
      UPDATE: 'settings:update',
      MANAGE: 'settings_manage'
    },
  
    canUpdateSettings: (user, updateArray) => {
      // 1. Normalização dos Roles: 
      // Extrai o slug do objeto Sequelize para comparar como string
      const roles = user.roles.map(r => {
          const slug = r.slug || (r.dataValues && r.dataValues.slug);
          return slug ? slug.toLowerCase() : '';
      });

      const isSuperAdmin = roles.includes('administrator');
      
      // 2. Chaves críticas
      const criticalKeys = [ 
        'upload_path.root',
        'upload_path.content',
        'upload_path.profile',
      ];
  
      // 3. Verificação das chaves (Sequelize retorna objetos {id, key})
      const hasCritical = updateArray.some(u => {
          const settingKey = u.key || (u.dataValues && u.dataValues.key);
          return criticalKeys.includes(settingKey);
      });
      
      console.log(`[Policy Check] Is Admin: ${isSuperAdmin} | Has Critical: ${hasCritical}`);

      // Se houver chave crítica e não for admin, bloqueia (false)
      if (hasCritical && !isSuperAdmin) return false;
      
      return true;
    }
};
  
module.exports = SETTINGS_POLICY;