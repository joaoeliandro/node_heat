import { serverHttp } from './app';

serverHttp.listen(3333, () => {
  console.log('Server started on port 3333');
});
