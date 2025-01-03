import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      accessToken
      user {
        _id
        avatar {
          _id
          fileName
          fileSize
          original
          status
          fileType
        }
        roles {
          roleType
        }
        name
        email
        status
        username
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        _id
        username
        roles {
          roleType
        }
        name
        email
        status
      }
    }
  }
`;

export const REQUEST_RESET_PASSWORD = gql`
  mutation RequestResetPassword($email: String!) {
    requestResetPassword(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
      message
    }
  }
`;
