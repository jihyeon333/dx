<script setup>
import Title from '@/components/common/Title.vue';
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import EditUserForm from '@/components/Login/EditUserForm.vue';
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import customArrowIcon from "@/assets/image/icon/chevron-down.svg";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="개인 정보" />
      <CardBox class="edit">
        <EditUserForm class="edit-form" title="개인 정보 수정" />
      </CardBox>
    </div>
  </div>
</template>