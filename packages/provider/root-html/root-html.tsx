'use client';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import Head from 'next/head';
import type { RootHtmlProps } from '@/packages/provider/root-html/root-html.type';

const RootHtml: FC<RootHtmlProps> = (props) => {
  const { children } = props;

  return (
    <html>
      {children}
    </html>
  );
};

export default RootHtml;
