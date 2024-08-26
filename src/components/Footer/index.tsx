import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by JMaluendas"
      links={[
        {
          key: 'Berlinas',
          title: 'Berlinas del Fonce S.A.',
          href: 'https://www.berlinasdelfonce.com/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'http://wsdx.berlinasdelfonce.com',
          blankTarget: true,
        },
        {
          key: 'JMaluendas',
          title: 'Jorge Maluendas',
          href: 'http://wsdx.berlinasdelfonce.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
