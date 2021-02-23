export const RootApiEndPoint = 'http://alumine.edu:8080/tissue-scan';

export const environment = {
  production: true,
  protocolsApiEndPoint: RootApiEndPoint + '/protocols',
  imageBatchesApiEndPoint: RootApiEndPoint + '/image-batches',
  imageFilesApiEndPoint: RootApiEndPoint + '/image-batches/image-files',
  imageFileApiEndPoint: RootApiEndPoint + '/image-batches/image-file',
  imagesApiEndPoint: RootApiEndPoint + '/image-batches/images',
  imageApiEndPoint: RootApiEndPoint + '/image-batches/image', 
  imageBatchesDataExportApiEndPoint: RootApiEndPoint + '/image-batches/data-export', 
  usersApiEndPoint: RootApiEndPoint + '/users'
};

export const GoogleClientId = 'UNDEFINED.apps.googleusercontent.com';


