/* eslint-env jest */
/**
 * Mock for Cloudflare R2 / AWS S3 service.
 */

export const mockS3Client = {
  send: jest.fn(() =>
    Promise.resolve({
      $metadata: { httpStatusCode: 200 },
    })
  ),
};

export const mockPutObjectCommand = jest.fn();

export const mockR2Upload = {
  uploadToR2: jest.fn((file, path) => Promise.resolve(`https://mock-r2.example.com/${path}`)),
  uploadProfilePicture: jest.fn((userId, file) =>
    Promise.resolve(`https://mock-r2.example.com/profiles/${userId}/avatar.jpg`)
  ),
  uploadRouteImage: jest.fn((routeId, file) =>
    Promise.resolve(`https://mock-r2.example.com/routes/${routeId}/image.jpg`)
  ),
  uploadAlertPhoto: jest.fn((alertId, file) =>
    Promise.resolve(`https://mock-r2.example.com/alerts/${alertId}/photo.jpg`)
  ),
};
