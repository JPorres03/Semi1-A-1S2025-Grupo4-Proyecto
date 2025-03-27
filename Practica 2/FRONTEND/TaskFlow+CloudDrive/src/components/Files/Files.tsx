import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import archivos from "../../../MOCK_DATA_FILES.json";
import txt from "../../assets/txt.png";
import image from "../../assets/image.png";

interface File {
    id: number;
    url: string;
}

function Files() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/files');
                if (response.ok) {
                    const data = await response.json();
                    setFiles(data || []);
                } else {
                    // Si la API falla o devuelve null, usamos los datos mock
                    setFiles(archivos || []);
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                setFiles(archivos || []);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const getFileType = (url: string) => {
        if (!url) return 'unknown';

        const extension = (url.split('.').pop() || '').toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const textExtensions = ['txt', 'csv', 'json', 'xml', 'md'];

        if (imageExtensions.includes(extension)) {
            return 'image';
        } else if (textExtensions.includes(extension)) {
            return 'text';
        }
        return 'unknown';
    };

    const extractFileName = (url: string) => {
        if (!url) return 'Unknown file';

        // Extraer el nombre del archivo de la URL
        const fileName = (url.split('/').pop() ?? '').split('.').shift() ?? 'Unknown';
        // Formatear el nombre para que sea más legible
        return fileName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleFileClick = async (file: File) => {
        const fileType = getFileType(file.url);

        if (fileType === 'image') {
            Swal.fire({
                title: extractFileName(file.url),
                imageUrl: file.url,
                imageAlt: extractFileName(file.url),
                imageHeight: 'auto',
                imageWidth: '80%',
                showCloseButton: true,
                showConfirmButton: false,
                background: '#fff',
                backdrop: 'rgba(0,0,0,0.5)',
                customClass: {
                    popup: 'custom-swal-popup',
                    image: 'custom-swal-image'
                }
            });
        } else if (fileType === 'text') {
            try {
                const response = await fetch(file.url);
                if (response.ok) {
                    const textContent = await response.text();
                    Swal.fire({
                        title: extractFileName(file.url),
                        html: `<pre style="text-align: left; max-height: 400px; overflow: auto;">${textContent}</pre>`,
                        showCloseButton: true,
                        confirmButtonText: 'Close'
                    });
                } else {
                    throw new Error('Failed to load file');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Could not load the file content',
                    icon: 'error'
                });
            }
        } else {
            Swal.fire({
                title: extractFileName(file.url),
                text: 'This file type cannot be previewed',
                icon: 'info'
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-row align-items-center justify-content-center mb-3 w-100">
                <input type="file" className="form-control w-50" />
                <button id="btnUpload" className="btn mx-5 fs-5">Upload file</button>
            </div>
            <div className="filesContainer d-flex flex-wrap justify-content-center gap-4 p-4">
                {files.map((file) => {
                    const fileType = getFileType(file.url);
                    const fileName = extractFileName(file.url);
                    const iconSrc = fileType === 'image' ? image : txt;

                    return (
                        <div
                            key={file.id}
                            className="file-item d-flex flex-column align-items-center"
                            style={{ cursor: 'pointer', width: '120px' }}
                            onClick={() => handleFileClick(file)}
                        >
                            <img
                                src={fileType === 'image' ? file.url : iconSrc}
                                alt={fileName}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: fileType === 'image' ? 'cover' : 'contain',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px'
                                }}
                            />
                            <span className="mt-2 text-center text-light" style={{ fontSize: '0.8rem' }}>
                                {fileName}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Files;