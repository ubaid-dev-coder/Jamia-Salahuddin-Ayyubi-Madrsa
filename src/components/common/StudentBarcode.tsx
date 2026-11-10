import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';

interface StudentBarcodeProps {
  studentId: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
}

export const StudentBarcode: React.FC<StudentBarcodeProps> = ({
  studentId,
  width = 1.6,
  height = 42,
  displayValue = true,
  fontSize = 12,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && studentId) {
      try {
        JsBarcode(svgRef.current, studentId, {
          format: 'CODE128',
          width,
          height,
          displayValue,
          fontSize,
          textMargin: 2,
          margin: 4,
          background: 'transparent',
          lineColor: '#064e3b',
        });
      } catch (err) {
        console.warn('Barcode render error for:', studentId, err);
      }
    }
  }, [studentId, width, height, displayValue, fontSize]);

  return <svg ref={svgRef} className="max-w-full inline-block" />;
};

interface StudentQRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export const StudentQRCode: React.FC<StudentQRCodeProps> = ({
  value,
  size = 72,
  level = 'M',
}) => {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level={level}
      includeMargin={false}
      fgColor="#042f24"
      bgColor="#ffffff"
      className="rounded-lg shadow-xs"
    />
  );
};
