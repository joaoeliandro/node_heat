import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  public async execute(code: string) {
    const url_access_token = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url_access_token, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    const url_user = 'https://api.github.com/user';

    const { data: user_github } = await axios.get<IUserResponse>(url_user, {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      },
    });

    const { id, login, name, avatar_url } = user_github;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url,
        },
      });
    };

    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id,
      }
    }, process.env.JWT_TOKEN, {
      subject: user.id,
      expiresIn: '1d',
    });

    return { token, user };
  }
}

export { AuthenticateUserService };
