<script setup>
import { ref, computed } from "vue";

const formData = ref({
  subject: "",
  content: "",
});

const emailList = ref([""]);
const selectedFile = ref(null);
const isProcessing = ref(false);
const statusMessage = ref("");
const statusType = ref("");

const errors = ref({
  recipients: null,
  subject: null,
  content: null,
  file: null,
});

// Filter empty email and invalid formats
const validRecipients = computed(() =>
  emailList.value.filter((email) => email.trim() && email.includes("@"))
);

const submitForm = async () => {
  validateEmails(true);
  validateSubject(true);
  validateContent(true);
  if (
    !errors.value.recipients &&
    !errors.value.subject &&
    !errors.value.content &&
    !errors.value.file
  ) {
    await processEmailSubmission();
  }
};

const processEmailSubmission = async () => {
  isProcessing.value = true;
  statusMessage.value = "";
  const payload = {
    to: validRecipients.value,
    subject: formData.value.subject,
    content: formData.value.content,
  };
  if (selectedFile.value) {
    const fileContent = await convertFile(selectedFile.value);
    payload.attachment = {
      content: fileContent,
      filename: selectedFile.value.name,
      type: selectedFile.value.type || "application/octet-stream",
    };
  }
  try {
    const response = await fetch("https://sendemail-pmr3mcznla-uc.a.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Parse and verify the response
    const result = await response.json();
    // Check if the cloud function actually succeeded
    if (result && result.success === true) {
      statusMessage.value = "Email sent successfully!";
      statusType.value = "success";
      clearForm();
    } else {
      statusMessage.value = result.error || "Email sending failed";
      statusType.value = "error";
    }
  } catch (error) {
    statusMessage.value = `Failed to send message: ${error.message}`;
    statusType.value = "error";
  }
  isProcessing.value = false;
};

// Convert file to base64
const convertFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
};

const clearForm = () => {
  formData.value = { subject: "", content: "" };
  emailList.value = [""];
  selectedFile.value = null;
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = "";
};

const addRecipient = () => {
  emailList.value.push("");
};

const handleFileSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      errors.value.file = "File size must be less than 10MB";
      event.target.value = "";
      return;
    }
    selectedFile.value = file;
    errors.value.file = null;
  }
};

const calculateFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateEmails = (blur) => {
  if (validRecipients.value.length === 0) {
    if (blur) errors.value.recipients = "At least one valid email is required";
  } else {
    errors.value.recipients = null;
  }
};

const validateSubject = (blur) => {
  if (formData.value.subject.length < 3) {
    if (blur) errors.value.subject = "Subject must be at least 3 characters";
  } else if (formData.value.subject.length > 50) {
    if (blur) errors.value.subject = "Subject must be within 50 characters";
  } else {
    errors.value.subject = null;
  }
};

const validateContent = (blur) => {
  if (formData.value.content.length > 500) {
    if (blur) errors.value.content = "Message must be within 500 characters";
  } else {
    errors.value.content = null;
  }
};
</script>

<template>
  <div class="form-container">
    <div>
      <h1 class="text-center">Send Email</h1>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="recipients" class="form-label">Recipients</label>
          <div
            v-for="(email, index) in emailList"
            :key="index"
            class="input-group mb-2"
          >
            <input
              v-model="emailList[index]"
              type="email"
              class="form-control"
              id="recipients"
              @blur="() => validateEmails(true)"
              @input="() => validateEmails(false)"
              placeholder="Enter email address"
            />
          </div>
          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="addRecipient"
          >
            + Add Recipient
          </button>
          <div v-if="errors.recipients" class="text-danger">
            {{ errors.recipients }}
          </div>
        </div>

        <div class="mb-3">
          <label for="subject" class="form-label">Subject</label>
          <input
            type="text"
            class="form-control"
            id="subject"
            @blur="() => validateSubject(true)"
            @input="() => validateSubject(false)"
            v-model="formData.subject"
          />
          <div v-if="errors.subject" class="text-danger">
            {{ errors.subject }}
          </div>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Message</label>
          <textarea
            class="form-control"
            id="content"
            rows="6"
            v-model="formData.content"
            @blur="() => validateContent(true)"
            @input="() => validateContent(false)"
          ></textarea>
          <div v-if="errors.content" class="text-danger">
            {{ errors.content }}
          </div>
        </div>
        <div class="mb-3">
          <label for="attachment" class="form-label">Attach files</label>
          <input
            type="file"
            class="form-control"
            id="attachment"
            @change="handleFileSelection"
            accept="*/*"
          />
          <small class="text-muted">Maximum file size: 10MB</small>
          <div v-if="selectedFile" class="mt-2">
            <span class="badge bg-secondary"
              >{{ selectedFile.name }} ({{
                calculateFileSize(selectedFile.size)
              }})</span
            >
          </div>
          <div v-if="errors.file" class="text-danger">{{ errors.file }}</div>
        </div>
        <div class="text-center">
          <button
            type="submit"
            class="btn btn-primary me-2"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "Processing..." : "Send" }}
          </button>
          <button type="button" class="btn btn-secondary" @click="clearForm">
            Clear
          </button>
        </div>
      </form>
      <div
        v-if="statusMessage"
        class="alert mt-3"
        :class="statusType === 'success' ? 'alert-success' : 'alert-danger'"
      >
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>