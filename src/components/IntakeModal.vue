<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Check, ChevronLeft, ChevronRight, ClipboardCheck, X } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useWorkshopStore } from '@/stores/workshop'
import type { NewWorkOrder } from '@/types/workshop'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const router = useRouter()
const store = useWorkshopStore()
const step = ref(1)
const errors = reactive<Record<string, string>>({})
const submittedId = ref('')

const defaultDue = () => {
  const date = new Date(); date.setDate(date.getDate() + 2)
  return date.toISOString().slice(0, 10)
}
const blankForm = (): NewWorkOrder => ({
  customerName: '', customerPhone: '', make: '', model: '', year: new Date().getFullYear(), registration: '',
  service: '', notes: '', priority: 'standard', dueAt: defaultDue(),
})
const form = reactive<NewWorkOrder>(blankForm())

watch(() => props.open, (open) => {
  if (open) { step.value = 1; submittedId.value = ''; Object.assign(form, blankForm()); Object.keys(errors).forEach((key) => delete errors[key]) }
})

const title = computed(() => submittedId.value ? 'Intake created' : step.value === 1 ? 'Customer & vehicle' : 'Service details')

function validateStepOne() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (form.customerName.trim().length < 2) errors.customerName = 'Enter the customer’s name.'
  if (!/^\+?[\d\s-]{8,}$/.test(form.customerPhone.trim())) errors.customerPhone = 'Enter a valid phone number.'
  if (!form.make.trim()) errors.make = 'Vehicle make is required.'
  if (!form.model.trim()) errors.model = 'Vehicle model is required.'
  if (form.year < 1980 || form.year > new Date().getFullYear() + 1) errors.year = 'Check the model year.'
  if (form.registration.trim().length < 4) errors.registration = 'Registration is required.'
  if (!Object.keys(errors).length) step.value = 2
}

function submit() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (form.service.trim().length < 4) errors.service = 'Describe the requested service.'
  if (!form.dueAt) errors.dueAt = 'Choose a promised date.'
  if (Object.keys(errors).length) return
  submittedId.value = store.addWorkOrder({ ...form })
}

function closeAndView() {
  emit('close')
  router.push('/work-orders')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-layer" @mousedown.self="$emit('close')">
        <section class="intake-modal" role="dialog" aria-modal="true" aria-labelledby="intake-title">
          <header class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-icon"><ClipboardCheck :size="20" /></span>
              <div><span class="eyebrow">New work order</span><h2 id="intake-title">{{ title }}</h2></div>
            </div>
            <button class="icon-button" aria-label="Close intake" @click="$emit('close')"><X :size="20" /></button>
          </header>

          <div v-if="submittedId" class="success-state">
            <span class="success-icon"><Check :size="29" /></span>
            <h3>{{ submittedId }} is on the board</h3>
            <p>The vehicle was added to Intake. Assign a technician and advance it when diagnostics begin.</p>
            <button class="button button--primary" @click="closeAndView">View work orders <ChevronRight :size="18" /></button>
          </div>

          <form v-else @submit.prevent="step === 1 ? validateStepOne() : submit()">
            <div class="stepper" aria-label="Intake progress">
              <span class="active"><i>1</i>Vehicle</span><b /><span :class="{ active: step === 2 }"><i>2</i>Service</span>
            </div>
            <div v-if="step === 1" class="form-body">
              <div class="form-section-label">Customer</div>
              <div class="form-grid form-grid--2">
                <label class="field"><span>Full name</span><input v-model="form.customerName" autocomplete="name" placeholder="e.g. Maria Ionescu" :aria-invalid="!!errors.customerName" /><small v-if="errors.customerName">{{ errors.customerName }}</small></label>
                <label class="field"><span>Phone number</span><input v-model="form.customerPhone" autocomplete="tel" placeholder="+40 7xx xxx xxx" :aria-invalid="!!errors.customerPhone" /><small v-if="errors.customerPhone">{{ errors.customerPhone }}</small></label>
              </div>
              <div class="form-section-label">Vehicle</div>
              <div class="form-grid form-grid--2">
                <label class="field"><span>Make</span><input v-model="form.make" placeholder="Volkswagen" :aria-invalid="!!errors.make" /><small v-if="errors.make">{{ errors.make }}</small></label>
                <label class="field"><span>Model</span><input v-model="form.model" placeholder="Golf VII" :aria-invalid="!!errors.model" /><small v-if="errors.model">{{ errors.model }}</small></label>
                <label class="field"><span>Model year</span><input v-model.number="form.year" type="number" min="1980" :max="new Date().getFullYear() + 1" :aria-invalid="!!errors.year" /><small v-if="errors.year">{{ errors.year }}</small></label>
                <label class="field"><span>Registration</span><input v-model="form.registration" placeholder="B 123 ABC" autocapitalize="characters" :aria-invalid="!!errors.registration" /><small v-if="errors.registration">{{ errors.registration }}</small></label>
              </div>
            </div>
            <div v-else class="form-body">
              <label class="field"><span>Requested service</span><input v-model="form.service" placeholder="e.g. Annual service & brake inspection" :aria-invalid="!!errors.service" /><small v-if="errors.service">{{ errors.service }}</small></label>
              <label class="field"><span>Intake notes <em>Optional</em></span><textarea v-model="form.notes" rows="3" placeholder="Symptoms, customer requests, useful context…" /></label>
              <div class="form-grid form-grid--2">
                <label class="field"><span>Promised date</span><input v-model="form.dueAt" type="date" :min="new Date().toISOString().slice(0, 10)" :aria-invalid="!!errors.dueAt" /><small v-if="errors.dueAt">{{ errors.dueAt }}</small></label>
                <fieldset class="field priority-field"><legend>Priority</legend><div><label><input v-model="form.priority" type="radio" value="standard" />Standard</label><label><input v-model="form.priority" type="radio" value="urgent" />Urgent</label></div></fieldset>
              </div>
            </div>
            <footer class="modal-footer">
              <span>Step {{ step }} of 2</span>
              <div>
                <button v-if="step === 2" type="button" class="button button--ghost" @click="step = 1"><ChevronLeft :size="17" /> Back</button>
                <button type="submit" class="button button--primary">{{ step === 1 ? 'Continue' : 'Create work order' }}<ChevronRight :size="17" /></button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
