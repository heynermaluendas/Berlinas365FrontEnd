import {  Table ,Input,   } from 'antd';
import { QuestionCircleOutlined,   } from '@ant-design/icons';
import React, { useState,useEffect   } from 'react';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import axios from 'axios';


export type SiderTheme = 'light' | 'dark';
// import { Tabla } from '@/components';

export const SelectLang= () => {
  return (
    <UmiSelectLang />
  );
};
export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

 


 