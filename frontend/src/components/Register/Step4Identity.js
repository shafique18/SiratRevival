import React from "react";
import toast from "react-hot-toast";
import InputField from "./InputField";
import FileDropzone from "../FileDropzone";

export default function Step4Identity({ formik }) {
  // Upload file helper
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/auth/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "File upload failed");
    }

    const data = await response.json();
    return data.filePath;
  };

  // Handle file input change
  const handleFileChange = async (file, fieldName) => {
    if (!file) return;

    try {
      toast.loading("Uploading file...", { id: "upload" });

      // Upload file to server
      const uploadedPath = await uploadFile(file);

      // Save the uploaded file path (string) in Formik
      formik.setFieldValue(fieldName, uploadedPath);

      toast.dismiss("upload");
      toast.success("File uploaded!");
    } catch (error) {
      toast.dismiss("upload");
      toast.error("Upload failed: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <InputField label="National ID" name="national_id_number" formik={formik} />
      <InputField label="Passport Number" name="passport_number" formik={formik} />

      {/* ID Document Upload */}
      <FileDropzone
        formik={formik}
        name="id_document_path"
        label="Upload ID Document *"
        onFileSelected={(file) => handleFileChange(file, "id_document_path")}
        acceptedFileTypes={["image/*", ".pdf"]}
      />
      {formik.errors.id_document_path && formik.touched.id_document_path && (
        <p className="text-red-600 text-sm">{formik.errors.id_document_path}</p>
      )}
      {formik.values.id_document_path && typeof formik.values.id_document_path === "string" && (
        <p className="text-green-700 text-sm mt-1">
          Uploaded: {formik.values.id_document_path}
        </p>
      )}

      {/* Selfie with ID */}
      <FileDropzone
        formik={formik}
        name="selfie_with_id_path"
        label="Upload Selfie with ID *"
        onFileSelected={(file) => handleFileChange(file, "selfie_with_id_path")}
        acceptedFileTypes={["image/*"]}
      />
      {formik.errors.selfie_with_id_path && formik.touched.selfie_with_id_path && (
        <p className="text-red-600 text-sm">{formik.errors.selfie_with_id_path}</p>
      )}
      {formik.values.selfie_with_id_path && typeof formik.values.selfie_with_id_path === "string" && (
        <p className="text-green-700 text-sm mt-1">
          Uploaded: {formik.values.selfie_with_id_path}
        </p>
      )}

      {/* Video Verification */}
      <FileDropzone
        formik={formik}
        name="video_verification_path"
        label="Upload Video Verification *"
        onFileSelected={(file) => handleFileChange(file, "video_verification_path")}
        acceptedFileTypes={["video/*"]}
      />
      {formik.errors.video_verification_path && formik.touched.video_verification_path && (
        <p className="text-red-600 text-sm">{formik.errors.video_verification_path}</p>
      )}
      {formik.values.video_verification_path && typeof formik.values.video_verification_path === "string" && (
        <p className="text-green-700 text-sm mt-1">
          Uploaded: {formik.values.video_verification_path}
        </p>
      )}
    </div>
  );
}



 {/* Optional S3 Upload Example (commented for now) */}
      {/*
      const uploadToS3 = async (file) => {
        const presignedUrlRes = await fetch('/api/get-presigned-url', {
          method: 'POST',
          body: JSON.stringify({ fileName: file.name, fileType: file.type }),
        });
        const { url, key } = await presignedUrlRes.json();
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        return key; // or full URL if configured that way
      };
      */}