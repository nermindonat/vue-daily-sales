<template>
  <AuthLayout>
    <div class="flex flex-col justify-center w-full max-w-xs">
      <h2 class="mb-8 text-2xl font-bold leading-9 text-center text-gray-900">
        {{ "Login to your account" }}
      </h2>
      <form class="flex flex-col gap-5" @submit="submitHandler">
        <BaseInput
          name="email"
          type="email"
          autocomplete="email"
          label="Email"
          size="md"
        />
        <BaseInput
          name="password"
          type="password"
          autocomplete="current-password"
          label="Password"
          size="md"
        />
        <BaseButton
          type="submit"
          class="w-full"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          >{{ "Login" }}</BaseButton
        >
      </form>
    </div>
  </AuthLayout>
</template>

<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { object, string } from "yup";

const store = useStore();
const router = useRouter();

const validationSchema = computed(() =>
  toTypedSchema(
    object({
      email: string().required(),
      password: string().required(),
    })
  )
);

const { handleSubmit, isSubmitting } = useForm({ validationSchema });

const submitHandler = handleSubmit(async (values) => {
  try {
    await store.dispatch("login", values);
    router.push("/daily-sales");
  } catch (error) {
    console.log(error);
  }
});
</script>
