import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/auth-context'
import { SubmissionNotice } from './SubmissionNotice'
import { conference } from '../content/conference'
import { countries } from '../data/countries'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Submission, SubmissionStatus } from '../types/backend'

type SubmissionFields = {
  presentationType: 'poster' | 'oral' | ''
  topic: string
  paperTitle: string
  authorsName: string
  institutionName: string
  countryRegion: string
  contactEmail: string
}

const emptyForm: SubmissionFields = {
  presentationType: '',
  topic: '',
  paperTitle: '',
  authorsName: '',
  institutionName: '',
  countryRegion: '',
  contactEmail: '',
}

const maxFileSize = 20 * 1024 * 1024
const allowedExtensions = ['doc', 'docx', 'pdf']

export function SubmissionEditor({ participantName = '' }: { participantName?: string }) {
  const { user, loading: authLoading } = useAuth()
  const [form, setForm] = useState<SubmissionFields>(emptyForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingFilePath, setExistingFilePath] = useState<string | null>(null)
  const [existingFileName, setExistingFileName] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null)
  const [showTopicError, setShowTopicError] = useState(false)
  const [loadingSubmission, setLoadingSubmission] = useState(false)
  const [savingAs, setSavingAs] = useState<SubmissionStatus | null>(null)
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeWarning, setNoticeWarning] = useState('')
  const [loadedName, setLoadedName] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const fullName = participantName || loadedName || [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(' ') || 'participant'

  useEffect(() => {
    const client = supabase
    if (!client || !user) return


    let active = true
    const loadSubmission = async () => {
      setLoadingSubmission(true)
      setMessage('')
      const [submissionResult, profileResult] = await Promise.all([
        client.from('submissions').select('*').eq('user_id', user.id).maybeSingle(),
        client.from('profiles').select('contact_email, institution, country_region, first_name, last_name').eq('user_id', user.id).maybeSingle(),
      ])
      if (!active) return

      if (submissionResult.error || profileResult.error) {
        setMessage(submissionResult.error?.message || profileResult.error?.message || 'Unable to load your submission. Please reload the page.')
        setLoadFailed(true)
        setLoadingSubmission(false)
        return
      }
      setLoadFailed(false)

      const submission = submissionResult.data as Submission | null
      const profile = profileResult.data as { contact_email?: string; institution?: string; country_region?: string; first_name?: string; last_name?: string } | null
      setLoadedName([profile?.first_name, profile?.last_name].filter(Boolean).join(' '))
      if (submission) {
        setForm({
          presentationType: submission.presentation_type,
          topic: submission.topic,
          paperTitle: submission.paper_title,
          authorsName: submission.authors_name,
          institutionName: submission.institution_name,
          countryRegion: submission.country_region,
          contactEmail: submission.contact_email,
        })
        setExistingFilePath(submission.file_path)
        setExistingFileName(submission.file_name)
        setSubmissionStatus(submission.status)
      } else {
        setForm({
          ...emptyForm,
          institutionName: profile?.institution ?? '',
          countryRegion: profile?.country_region ?? '',
          contactEmail: profile?.contact_email || user.email || '',
        })
      }
      setLoadingSubmission(false)
    }

    loadSubmission()
    return () => { active = false }
  }, [user])

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (name === 'topic') setShowTopicError(!value)
  }

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setMessage('')
    setSelectedFile(null)
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!allowedExtensions.includes(extension)) {
      event.target.value = ''
      setMessage('Please upload a Word or PDF file.')
      return
    }
    if (file.size > maxFileSize) {
      event.target.value = ''
      setMessage('The file must be 20 MB or smaller.')
      return
    }
    setSelectedFile(file)
  }

  const saveSubmission = async (status: SubmissionStatus) => {
    if (!supabase || !user || savingAs || loadFailed) return

    if (status === 'submitted') {
      setShowTopicError(!form.topic)
      const requiredFields = [
        form.presentationType,
        form.topic,
        form.paperTitle,
        form.authorsName,
        form.institutionName,
        form.countryRegion,
        form.contactEmail,
      ]
      if (requiredFields.some((value) => !value.trim()) || (!selectedFile && !existingFilePath)) {
        setMessage('Please complete all fields and upload a Word or PDF file before submitting.')
        return
      }
    }

    setSavingAs(status)
    setMessage('')
    let uploadedPath = existingFilePath
    let uploadedName = existingFileName
    let newUploadPath: string | null = null
    let committed = false

    try {
      if (selectedFile) {
        const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]+/g, '-')
        newUploadPath = `${user.id}/${crypto.randomUUID()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('submission-files')
          .upload(newUploadPath, selectedFile, { upsert: false })
        if (uploadError) throw uploadError
        uploadedPath = newUploadPath
        uploadedName = selectedFile.name
      }

      const timestamp = new Date().toISOString()
      const { data, error } = await supabase
        .from('submissions')
        .upsert({
          user_id: user.id,
          presentation_type: form.presentationType,
          topic: form.topic,
          paper_title: form.paperTitle,
          authors_name: form.authorsName,
          institution_name: form.institutionName,
          country_region: form.countryRegion,
          contact_email: form.contactEmail,
          file_path: uploadedPath,
          file_name: uploadedName,
          status,
          updated_at: timestamp,
          submitted_at: status === 'submitted' ? timestamp : null,
        }, { onConflict: 'user_id' })
        .select('*')
        .single()
      if (error) throw error

      committed = true
      if (newUploadPath && existingFilePath && existingFilePath !== newUploadPath) {
        await supabase.storage.from('submission-files').remove([existingFilePath]).catch(() => undefined)
      }

      const saved = data as Submission
      setExistingFilePath(saved.file_path)
      setExistingFileName(saved.file_name)
      setSubmissionStatus(saved.status)
      if (selectedFile) {
        setSelectedFile(null)
        if (fileInput.current) fileInput.current.value = ''
      }
      let emailWarning = ''
      if (status === 'submitted' && import.meta.env.VITE_SUBMISSION_CONFIRMATION_EMAIL_ENABLED === 'true') {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-submission-confirmation')
          if (emailError) emailWarning = 'Your submission was saved, but email delivery could not be confirmed. Please check your inbox or contact the organizer.'
        } catch {
          emailWarning = 'Your submission was saved, but email delivery could not be confirmed. Please check your inbox or contact the organizer.'
        }
      }
      setNotice(status === 'submitted'
        ? 'Dear ' + fullName + ', your information has been successfully submitted to the GAIA Committee.'
        : 'Dear ' + fullName + ', your information has been successfully saved and updated. Please click "Submit" to send your submission to the GAIA Committee.')
      setNoticeWarning(status === 'draft' && !selectedFile ? 'Note: No file uploaded.' : emailWarning)
    } catch (error) {
      if (newUploadPath && !committed) await supabase.storage.from('submission-files').remove([newUploadPath]).catch(() => undefined)
      setMessage(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'The submission could not be saved.')
    } finally {
      setSavingAs(null)
    }
  }

  const downloadOwnFile = async () => {
    if (!supabase || !existingFilePath) return
    setDownloading(true)
    const { data, error } = await supabase.storage.from('submission-files').download(existingFilePath)
    setDownloading(false)
    if (error) {
      setMessage(error.message)
      return
    }
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = existingFileName || 'submission'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveSubmission('submitted')
  }

  return (
    <>
      {!isSupabaseConfigured ? (
        <section className="submission-form-section" data-reveal><div className="utility-notice"><strong>Online submission setup is in progress.</strong><p>The submission form will open after the conference account service is connected.</p></div></section>
      ) : authLoading || loadingSubmission ? (
        <div className="utility-loading">Loading your submission...</div>
      ) : !user ? (
        <section className="submission-form-section" data-reveal>
          <div className="auth-gate"><p className="section-kicker">ACCOUNT REQUIRED</p><h2>Sign in before submitting.</h2><p>Your draft and uploaded file will be linked securely to your participant account.</p><Link className="pill-action-link" to="/login" state={{ from: '/account' }}><span className="pill-link-icon" aria-hidden="true">→</span><strong>Sign in or register</strong></Link></div>
        </section>
      ) : (
        <section className="submission-form-section" data-reveal>
          <form className="submission-form" onSubmit={handleSubmit}>
            <fieldset className="submission-fields" disabled={Boolean(savingAs) || loadFailed}>
              {submissionStatus ? <p className={`submission-status is-${submissionStatus}`}>Current status: {submissionStatus}</p> : null}
              <div className="submission-fieldset">
                <p className="section-kicker">PRESENTATION TYPE</p>
                <div className="submission-choice-row">
                  <label><input type="radio" name="presentationType" value="poster" checked={form.presentationType === 'poster'} onChange={updateField} /> Poster</label>
                  <label><input type="radio" name="presentationType" value="oral" checked={form.presentationType === 'oral'} onChange={updateField} /> Oral presentation</label>
                </div>
              </div>

              <label className="submission-field"><span>Conference Topic</span><select name="topic" value={form.topic} onChange={updateField} onBlur={() => setShowTopicError(!form.topic)}><option value="">Select one topic</option>{conference.submissionTopics.map((item, index) => <option value={item} key={item}>{String(index + 1).padStart(2, '0')} — {item}</option>)}</select>{showTopicError ? <small className="submission-error">Please select one topic</small> : null}</label>
              <label className="submission-field"><span>Paper Title</span><input type="text" name="paperTitle" value={form.paperTitle} onChange={updateField} placeholder="Enter the poster or presentation title" /></label>
              <label className="submission-field"><span>Authors Name</span><input type="text" name="authorsName" value={form.authorsName} onChange={updateField} placeholder="Enter author names" /></label>
              <label className="submission-field"><span>Institution Name</span><input type="text" name="institutionName" value={form.institutionName} onChange={updateField} placeholder="Enter institution information" /></label>
              <label className="submission-field"><span>Country/Region</span><select name="countryRegion" value={form.countryRegion} onChange={updateField}><option value="">Select country or region</option>{countries.map((country) => <option value={country} key={country}>{country}</option>)}</select></label>
              <label className="submission-field"><span>Contact Email</span><input type="email" name="contactEmail" value={form.contactEmail} onChange={updateField} placeholder="name@example.com" /></label>
              <div className="submission-field submission-file">
                <label htmlFor="submission-file">Upload File</label>
                <div className="submission-file-picker">
                  <input id="submission-file" className="visually-hidden" ref={fileInput} type="file" name="submissionFile" onChange={chooseFile} accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf" />
                  <label className="file-select-button" htmlFor="submission-file">Select Files</label>
                  <p aria-live="polite">{selectedFile?.name || 'No file selected'}</p>
                </div>
                <small className="submission-file-warning">Note: The newly uploaded file will overwrite the existing file.<br />Accepted formats: Word or PDF. Maximum file size: 20 MB.</small>
              </div>

              {existingFilePath ? (
                <div className="submission-existing-file">
                  <p>Uploaded file: <strong>{existingFileName}</strong></p>
                  <button type="button" className="pill-action-link submission-button" disabled={downloading} onClick={downloadOwnFile}>
                    <span className="pill-link-icon" aria-hidden="true">↓</span><strong>{downloading ? 'Downloading...' : 'Download my file'}</strong>
                  </button>
                </div>
              ) : null}
            </fieldset>
            {message ? <p className="form-message submission-feedback" role="alert">{message}</p> : null}
            <div className="submission-actions">
              <button type="button" className="pill-action-link submission-button" onClick={() => saveSubmission('draft')} disabled={Boolean(savingAs) || loadFailed}><span className="pill-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12h12M12 6v12" /></svg></span><strong>{savingAs === 'draft' ? 'Saving...' : 'Save'}</strong></button>
              <button type="submit" className="pill-action-link submission-button" disabled={Boolean(savingAs) || loadFailed}><span className="pill-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" /></svg></span><strong>{savingAs === 'submitted' ? 'Submitting...' : 'Submit'}</strong></button>
            </div>
          </form>
        </section>
      )}
      <SubmissionNotice message={notice} warning={noticeWarning} onClose={() => { setNotice(''); setNoticeWarning('') }} />
    </>
  )
}
