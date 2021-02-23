export const RootApiEndPoint = 'https://histoq-backend.herokuapp.com';

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

export const GoogleClientId = '1093064661917-36og4fq7sve1mh16i9u91rdcp2em32ql.apps.googleusercontent.com';


