// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /ap/currentUser */
const mockedCurrentUser: API.CurrentUser = {
  name: 'JMaluendas',
  avatar: 'https://i.pinimg.com/736x/d6/79/38/d67938f7710dce3829be1757e1096f5d.jpg',
  userid: '123',
  email: 'usuario.ejemplo@example.com',
  signature: 'Firma de usuario',
  title: 'Título de usuario',
  group: 'Grupo de usuario',
  tags: [
    { key: 'tag3', label: 'Etiqueta 1' },
    { key: 'tag2', label: 'Etiqueta 2' },
  ],
  notifyCount: 5,
  unreadCount: 10,
  country: 'País del usuario',
  access: 'Acceso del usuario',
  geographic: {
    province: { label: 'Provincia del usuario', key: 'province_key' },
    city: { label: 'Ciudad del usuario', key: 'city_key' },
  },
  address: 'Dirección del usuario',
  phone: '123-456-7890',
};

export async function currentUser(options?: { [key: string]: any }) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userName = mockedCurrentUser.name;

    return {
      data: mockedCurrentUser,
    };
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    throw error; 
  }
}

/** 退出登录接口 POST /ap/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { data: {}, success: true };
}


interface API {
  LoginParams: {
    username: string;
    password: string;
    type?: string;
  };
  LoginResult: {
    status: string;
    type: string;
    currentAuthority: string;
  };
}


const validUsername = 'JMaluendas';
const validPassword = '8080JM';



/** 登录接口 POST /ap/login/account */

export async function login(body: LoginParams, options?: { [key: string]: any }): Promise<LoginResult> {
  try {
    const { username, password } = body;

    // Verificación de usuario y contraseña
    if (username === validUsername && password === validPassword) {
      // Simulación de respuesta de la API para login exitoso
      const response: LoginResult = {
        status: "ok",
        type: "account",
        currentAuthority: "admin"
      };
      return response;
    } else {
      // Simulación de respuesta de la API para login fallido
      const response: LoginResult = {
        status: "error",
        type: "account",
        currentAuthority: "guest"
      };
      return response;
    }
  } catch (error) {
    console.error('Error en la función login:', error);
    throw error;
  }
}
/** 此处后端没有提供注释 GET /ap/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/ap/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /ap/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /ap/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /ap/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /ap/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
