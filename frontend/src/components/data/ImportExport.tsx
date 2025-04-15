import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download, Upload, FileText, CheckCircle, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

type DataType = 'inventory' | 'users' | 'sales' | 'expenses';
type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ImportPreviewData {
  headers: string[];
  rows: any[];
  errors: { row: number; message: string }[];
}

const TEMPLATES = {
  inventory: [
    'name', 'category', 'description', 'buyingPrice', 'sellingPrice', 'quantity', 'imageUrl'
  ],
  users: [
    'username', 'fullName', 'email', 'role'
  ],
  sales: [
    'itemId', 'quantity', 'sellingPrice', 'attendantId', 'saleDate'
  ],
  expenses: [
    'description', 'amount', 'category', 'date', 'isRecurring', 'recurringFrequency'
  ]
};

export function ImportExport() {
  const [selectedType, setSelectedType] = useState<DataType>('inventory');
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'processing'>('upload');
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [exportDateRange, setExportDateRange] = useState({
    from: '',
    to: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [backupProgress, setBackupProgress] = useState<number | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    onDrop: handleFileDrop
  });

  async function handleFileDrop(files: File[]) {
    const file = files[0];
    if (!file) return;

    try {
      // Simulate file parsing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock preview data
      setPreviewData({
        headers: TEMPLATES[selectedType],
        rows: [
          { id: 1, data: ['Sample Data', 'Category', 'Description', '100', '200', '10', ''] },
          { id: 2, data: ['Another Item', 'Category', 'Description', '150', '300', '5', ''] }
        ],
        errors: [
          { row: 2, message: 'Invalid price format' }
        ]
      });

      setImportStep('preview');
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Error parsing file');
    }
  }

  async function handleImport() {
    try {
      setImportStep('processing');
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data imported successfully');
      setImportStep('upload');
      setPreviewData(null);
    } catch (error) {
      toast.error('Import failed');
      setImportStep('preview');
    }
  }

  async function handleExport() {
    try {
      setIsExporting(true);
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, we would:
      // 1. Call the appropriate API endpoint
      // 2. Receive a blob/file
      // 3. Create a download link
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${selectedType}_export_${new Date().toISOString()}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export completed');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  }

  async function handleBackup() {
    try {
      // Simulate backup process with progress
      for (let i = 0; i <= 100; i += 10) {
        setBackupProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      toast.success('Backup completed');
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setBackupProgress(null);
    }
  }

  function downloadTemplate() {
    const headers = TEMPLATES[selectedType].join(',');
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedType}_template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
        Data Import & Export
      </h1>

      {/* Data Type Selection */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          Select Data Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(TEMPLATES).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as DataType)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedType === type
                  ? 'border-primary bg-primary/10'
                  : 'border-border dark:border-primary/20 hover:border-primary/50'
              }`}
            >
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <span className="font-medium text-primary capitalize">
                  {type}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Import Data
          </h2>

          {importStep === 'upload' && (
            <div className="space-y-4">
              <button
                onClick={downloadTemplate}
                className="btn-secondary w-full"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Template
              </button>

              <div
                {...getRootProps()}
                className="border-2 border-dashed border-border dark:border-primary/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-primary/20" />
                <p className="text-text-dark dark:text-text-light mb-2">
                  Drag & drop your file here, or click to select
                </p>
                <p className="text-sm text-text-dark/60">
                  Supported formats: CSV, Excel
                </p>
              </div>
            </div>
          )}

          {importStep === 'preview' && previewData && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border dark:border-primary/20">
                      {previewData.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-2 text-left text-sm font-semibold text-primary"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, rowIndex) => (
                      <tr
                        key={row.id}
                        className={`border-b border-border dark:border-primary/20 ${
                          previewData.errors.some(e => e.row === row.id)
                            ? 'bg-error/5'
                            : ''
                        }`}
                      >
                        {row.data.map((cell: any, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-sm text-text-dark dark:text-text-light"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {previewData.errors.length > 0 && (
                <div className="bg-error/5 rounded-lg p-4">
                  <h3 className="font-medium text-error flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Validation Errors
                  </h3>
                  <ul className="space-y-1 text-sm text-error">
                    {previewData.errors.map((error, index) => (
                      <li key={index}>
                        Row {error.row}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setImportStep('upload');
                    setPreviewData(null);
                  }}
                  className="px-4 py-2 text-text-dark dark:text-text-light hover:bg-primary/10 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={previewData.errors.length > 0}
                  className="btn-primary"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Import Data
                </button>
              </div>
            </div>
          )}

          {importStep === 'processing' && (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-text-dark dark:text-text-light">
                Importing data...
              </p>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Export Data
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                className="input-field"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={exportDateRange.from}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, from: e.target.value })}
                  className="input-field"
                />
                <input
                  type="date"
                  value={exportDateRange.to}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, to: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary w-full"
            >
              {isExporting ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Backup Section */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          System Backup
        </h2>

        <div className="space-y-4">
          {backupProgress !== null ? (
            <div className="space-y-2">
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${backupProgress}%` }}
                />
              </div>
              <p className="text-sm text-text-dark/60 text-center">
                Backup in progress: {backupProgress}%
              </p>
            </div>
          ) : (
            <button onClick={handleBackup} className="btn-secondary w-full">
              <Save className="h-5 w-5 mr-2" />
              Create Backup
            </button>
          )}

          <div className="bg-primary/5 rounded-lg p-4">
            <h3 className="font-medium text-primary flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Last Backup
            </h3>
            <p className="text-sm text-text-dark/60">
              Created on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}