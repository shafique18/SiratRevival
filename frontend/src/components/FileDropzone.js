import { useDropzone } from "react-dropzone";

function normalizeAcceptedFileTypes(types) {
  if (!types) return undefined;

  const accept = {};

  types.forEach((type) => {
    if (type.startsWith(".")) {
      // extensions - add under '*/*' wildcard
      accept["*/*"] = accept["*/*"] || [];
      accept["*/*"].push(type);
    } else if (type.includes("/")) {
      // MIME type
      accept[type] = accept[type] || [];
    } else {
      // fallback
      accept["*/*"] = accept["*/*"] || [];
      accept["*/*"].push(type);
    }
  });

  return accept;
}

export default function FileDropzone({ formik, name, label, onFileSelected, acceptedFileTypes }) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: normalizeAcceptedFileTypes(acceptedFileTypes),
  });

  const value = formik.values[name];

  let fileName = "";
  if (typeof value === "string") {
    fileName = value.split("/").pop();
  } else if (value && typeof value === "object" && value.name) {
    fileName = value.name;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? <p>{fileName}</p> : <p>Drag and drop a file here, or click to select</p>}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
}
