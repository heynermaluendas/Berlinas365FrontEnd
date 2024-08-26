import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet,   useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import "./overider.scss";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: 'green',
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      paddingTop:'2%',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});



const LoginMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values, type: 'account' });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = '¡Inicio de sesión exitoso!';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '¡Acceso fallido. Por favor intente nuevamente!';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{'Página de inicio de sesión'} - {Settings.title}</title>
      </Helmet>
      
      <div style={{ flex: '1', padding: '32px 0', }}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: 'Ingresar',
            },
            
          }}
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={
            <img
              alt="logo"
              style={{ width: '50px', height: '50px' }}
              src="https://saas-cms-admin-sandbox.s3.us-west-2.amazonaws.com/sites/647e59513d04a300028afa72/assets/647e59b2dab7bc0002cb4f42/favicon.png"
            />
          }
          className='titelBerlinas'
          title={<span style={{ fontWeight: 700 }}>{'BERLINAS'}</span>}
          subTitle={'Berlinas del fonce S.A.'}
          initialValues={{ autoLogin: true }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'Cuenta o contraseña incorrectas '} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '41px', textAlign: 'center',marginBottom:'30px' }}>
              <span className="green-tab">
                  {'Iniciar Sesión'}
                </span>
              </div>
          <ProFormText
            className="inputInput"
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={'Nombre de usuario'}
            rules={[
              {
                required: true,
                message: "¡Por favor ingrese el nombre de usuario!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={'Contraseña'}
            rules={[
              {
                required: true,
                message: "¡Por favor, introduzca su contraseña!",
              },
            ]}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox className='ant-checkbox' noStyle name="autoLogin">
              Recordar credenciales
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>
              <span style={{ color: '#009944' }}>
                ¿Olvidaste tu contraseña?
              </span>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
