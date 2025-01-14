'use client'

import React, {useEffect, useState} from 'react'
import {
    QRCode,
    Select,
    InputNumber,
    Button,
    Typography,
    Upload,
    Segmented, QRCodeProps, Flex, ColorPicker, Row, Col
} from 'antd'
import {
    DownloadOutlined,
    UploadOutlined,
    MinusOutlined,
    PlusOutlined
} from '@ant-design/icons'
import {LinkParams, useLinks} from "@/hooks/Links";
import {displayNotifications} from "@/utils/notifications";

const {Title, Text} = Typography
const {Option} = Select

const MIN_SIZE = 48;
const MAX_SIZE = 300;
export default function QRCodeGenerator() {
    const [logoSize, setLogoSize] = useState<number>(40);
    const [logo, setLogo] = useState<string | undefined>()
    const [color, setColor] = useState<string>('#000000')
    const [bgColor, setBgColor] = useState<string>('#ffffff')
    const [renderType, setRenderType] = React.useState<QRCodeProps['type']>('canvas');
    const [size, setSize] = useState<number>(220);
    const [level, setLevel] = useState<QRCodeProps['errorLevel']>('L');
    const {contextHolder} = displayNotifications()
    const {linkData, fetchLinks} = useLinks()

    const [selectedLink, setSelectedLink] = useState<LinkParams|null>(null)

    const increase = () => {
        setSize((prevSize) => {
            const newSize = prevSize + 10;
            if (newSize >= MAX_SIZE) {
                return MAX_SIZE;
            }
            return newSize;
        });
    };

    const decline = () => {
        setSize((prevSize) => {
            const newSize = prevSize - 10;
            if (newSize <= MIN_SIZE) {
                return MIN_SIZE;
            }
            return newSize;
        });
    };

    const handleColorOnChange = (value: { toHexString: () => React.SetStateAction<string>; }) => {
        setColor(value.toHexString());
    }

    const handleBgColorOnChange = (value: { toHexString: () => React.SetStateAction<string>; }) => {
        setBgColor(value.toHexString());
    }

    const handleLogoChange = (info: any) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl: string) => {
                setLogo(imageUrl)
            })
        }
    }

    function doDownload(url: string, fileName: string) {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const downloadCanvasQRCode = () => {
        const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            doDownload(url, 'QRCode.png');
        }
    };

    const downloadSvgQRCode = () => {
        const svg = document.getElementById('myqrcode')?.querySelector<SVGElement>('svg');
        const svgData = new XMLSerializer().serializeToString(svg!);
        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(blob);

        doDownload(url, 'QRCode.svg');
    };

    useEffect(() => {
        fetchLinks()
    }, []);
    return (
        <>
            {contextHolder}
            <Title level={4} style={{textAlign: 'center', marginBottom: '32px'}}>Generate QR codes for your available
                links</Title>
            <Row align='middle' justify='space-around'>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Flex vertical gap='middle' justify='center'>
                        <Flex>
                            <Select
                                style={{width: '100%', maxWidth: '300px', margin: 'auto'}}
                                value={selectedLink?.generated_url}
                                defaultValue='tialinks.com'
                                onChange={(value) => setSelectedLink(linkData?.find(link => link.generated_url === value) || null)}
                            >
                                {linkData?.map((link) => (
                                    <Option key={link.id} value={link.id}>{link.generated_url}</Option>
                                ))}
                            </Select>
                        </Flex>
                        <Flex vertical gap='middle' align='center' justify='center' style={{marginBottom: '20px'}}>
                            <QRCode id='myqrcode'
                                    value={selectedLink?.generated_url || 'tialinks.com'}
                                    icon={logo}
                                    iconSize={logoSize}
                                    type={renderType}
                                    errorLevel={level}
                                    bordered={false}
                                    color={color}
                                    bgColor={bgColor}
                                    size={size}
                                    style={{margin: "auto"}}
                            />
                        </Flex>

                    </Flex>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Flex vertical justify='end'>
                        <Flex align={'center'} gap='middle' style={{margin: 16}}>
                            <Text>QR Code size:</Text>
                            <Button.Group>
                                <Button onClick={decline} disabled={size <= MIN_SIZE} icon={<MinusOutlined/>}/>
                                <Button onClick={increase} disabled={size >= MAX_SIZE} icon={<PlusOutlined/>}/>
                            </Button.Group>
                        </Flex>
                        <Flex align={'center'} gap='middle' style={{margin: 16}}>
                            <Text> Image type: </Text>
                            <Segmented options={['canvas', 'svg']} value={renderType} onChange={setRenderType}/>
                        </Flex>
                        <Flex align={'center'} gap='middle' style={{margin: 16}}>
                            <Text> Error level: </Text>
                            <Segmented options={['L', 'M', 'Q', 'H']} value={level} onChange={setLevel}/>
                        </Flex>
                        <Flex align={'center'} gap='middle'>
                            <Row justify='start' style={{marginLeft: 16}}>
                                <Col xs={24} sm={24} md={12} lg={12} style={{margin: '16px 0'}}>
                                    <Flex align="center">
                                        <Text style={{marginRight: 4, minWidth: '45px'}}>Color: </Text>
                                        <ColorPicker value={color} defaultValue="#000000" size="small" showText
                                                     onChange={handleColorOnChange}/>
                                    </Flex>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} style={{margin: '16px 0'}}>
                                    <Flex align="center">
                                        <Text style={{marginLeft: 10, minWidth: '60px'}}>B-color:</Text>
                                        <ColorPicker value={bgColor} defaultValue="#000000" size="small" showText
                                                     onChange={handleBgColorOnChange}/>
                                    </Flex>
                                </Col>
                            </Row>
                        </Flex>
                        <Flex align={'center'} gap='middle'>
                            <Row justify='start' style={{marginLeft: 16}}>
                                <Col xs={24} sm={24} md={12} lg={12} style={{margin: '16px 0'}}>
                                    <Flex align="center">
                                        <Text style={{marginRight: 4, minWidth: '45px'}}>Logo: </Text>
                                        <Upload
                                            accept="image/*"
                                            showUploadList={false}
                                            customRequest={({file, onSuccess}: any) => {
                                                setTimeout(() => {
                                                    onSuccess("ok", file)
                                                }, 0)
                                            }}
                                            onChange={handleLogoChange}
                                        >
                                            <Button icon={<UploadOutlined/>}>Upload</Button>
                                        </Upload>
                                    </Flex>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} style={{margin: '16px 0px'}}>
                                    <Flex align="center">
                                        <Text style={{marginLeft: 10, minWidth: '45px'}}>Size:</Text>
                                        <InputNumber
                                        min={30}
                                        max={50}
                                        style={{width: 100 }}
                                        value={logoSize}
                                        onChange={(value) => setLogoSize(value || 50)}
                                        addonAfter="px"
                                    />
                                    </Flex>
                                </Col>
                            </Row>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
            <Flex align='end' justify='center' style={{
                width: '100%',
                height: 150,
                borderRadius: 6,
            }}>
                <Button
                    style={{width: '50%', maxWidth: '150px', padding: '10px'}}
                    type='primary'
                    icon={<DownloadOutlined/>}
                    onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                >
                    Download
                </Button>
            </Flex>
        </>
    )
}


function getBase64(img: File, callback: (url: string) => void) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
}
