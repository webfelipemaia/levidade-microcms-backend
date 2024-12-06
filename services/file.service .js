const db = require('../helpers/db.helper');
const fs = require('fs');
const path = require('path');
const { UPLOAD_PATH } = require('../helpers/constants.helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    renameAndUpdateFile,
};

async function getAll() {
    return await db.File.findAll();
}

async function getById(id) {
    return await getFile(id);
}

async function create(fileData) {
    return db.File.create(fileData);
}

async function update(id, params) {
    const file = await getFile(id);
    Object.assign(file, params);
    await file.save();
}

async function renameAndUpdateFile(id, params) {
    const file = await getFile(id);
    
    // Diretório onde os arquivos estão armazenados
    const uploadDir = path.dirname(file.path);

    // Recuperar a extensão do arquivo
    const fileExtension = path.extname(file.name);
    if (!fileExtension) {
        throw new Error("The original file does not have a valid extension.");
    }

    // Recuperar o nome original do arquivo e construir o caminho completo
    let oldFilePath = file.path;
    // Garantir que a extensão esteja presente no caminho
    if (!oldFilePath.endsWith(fileExtension)) {
        oldFilePath += fileExtension;
    }

    // Gerar o novo nome do arquivo com o ID do artigo como prefixo
    // O novo nome será no formato [ID]_[filename].ext
    const articleId = params.articleId;
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const newFileName = `${articleId}_${fileNameWithoutExt}${fileExtension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Renomear o arquivo no sistema de arquivos
    try {
        await fs.promises.rename(oldFilePath, newFilePath);
    } catch (error) {
        console.error(`Error renaming file: ${error}`);
        throw new Error('Error renaming file (in file system).');
    }

    // Atualizar o nome do arquivo no banco de dados
    file.name = newFileName;
    file.path = removeLastSegment(file.path)
    Object.assign(file, params);
    await file.save(); // Salva as alterações no banco de dados

    return newFileName;
}




async function _delete(id) {
    const file = await getFile(id);
    await file.destroy();
}

async function getFile(id) {
    const file = await db.File.findByPk(id);
    if (!file) throw 'File not found';
    return file;
}


// auxiliar functions

function removeLastSegment(path) {
    // Verifica se a string contém pelo menos uma barra
    if (!path.includes('/')) {
      return path;
    }
  
    // Encontra o índice da última barra e corta a string até essa posição
    const lastSlashIndex = path.lastIndexOf('/');
    return path.substring(0, lastSlashIndex + 1);
  }