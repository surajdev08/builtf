'use client'
import EditProvider from '@/views/providers/EditProvider'
import ProviderFormPage from '@/views/providers/EditProvider'
import { EditorProvider } from '@tiptap/react'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function page() {
  const serviceId = useSearchParams('serviceId')
  const providerId = useSearchParams('providerId') // Will be null for "add" mode
  return <EditProvider serviceId={serviceId} providerId={providerId} />
}
