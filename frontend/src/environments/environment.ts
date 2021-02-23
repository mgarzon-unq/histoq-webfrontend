// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//export const RootApiEndPoint = 'http://localhost:8080';
export const RootApiEndPoint = 'http://histoq-backend.herokuapp.com';

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
