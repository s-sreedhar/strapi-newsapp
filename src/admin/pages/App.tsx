import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextInput,
  Textarea,
  Grid,
  Alert,
  Flex,
  Typography,
  Main,
  SingleSelect,
  SingleSelectOption,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Badge,
  Field,
} from '@strapi/design-system';
import { Mail, Play, ArrowClockwise } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';

// Newsletter interface based on Strapi content type
interface Newsletter {
  id: number;
  title: string;
  subject: string;
  content: string;
  docstatus: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  meta?: any;
}

interface MessageResult {
  type: 'success' | 'error';
  message: string;
  success?: boolean;
}

const NewsletterApp: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [testEmail, setTestEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [result, setResult] = useState<MessageResult | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const { get, post } = useFetchClient();

  // Fetch newsletters on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadNewsletters = async () => {
      try {
        // Use admin Content Manager API endpoint for authenticated access
        const response = await get('/content-manager/collection-types/api::newsletter.newsletter?populate=*') as any;
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        console.log('API Response:', response);
        
        // Handle admin API response format (axios-style or direct)
         const payload = response?.data ?? response;
         let newsletterData: Newsletter[] = [];
         
         // Check for direct data array (Strapi v5 format)
         if (payload?.data && Array.isArray(payload.data)) {
           newsletterData = payload.data;
         } else if (payload?.results && Array.isArray(payload.results)) {
           newsletterData = payload.results;
         } else if (Array.isArray(payload)) {
           newsletterData = payload;
         } else {
           console.warn('Unexpected response format:', payload);
           newsletterData = [];
         }
        
        setNewsletters(newsletterData);
        console.log('Newsletters loaded:', newsletterData.length);
      } catch (error: any) {
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        if (error.name !== 'AbortError') {
          console.error('Error fetching newsletters:', error);
          setResult({ type: 'error', message: 'Failed to fetch newsletters. Please check if newsletters exist in Content Manager.' });
        }
        setNewsletters([]); // Ensure newsletters is always an array
      }
    };
    
    loadNewsletters();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchNewsletters = async (): Promise<void> => {
    try {
      // Use admin Content Manager API endpoint for authenticated access
      const response = await get('/content-manager/collection-types/api::newsletter.newsletter?populate=*') as any;
      console.log('API Response:', response);
      
      // Handle admin API response format (axios-style or direct)
       const payload = response?.data ?? response;
       let newsletterData: Newsletter[] = [];
       
       // Check for direct data array (Strapi v5 format)
       if (payload?.data && Array.isArray(payload.data)) {
         newsletterData = payload.data;
       } else if (payload?.results && Array.isArray(payload.results)) {
         newsletterData = payload.results;
       } else if (Array.isArray(payload)) {
         newsletterData = payload;
       } else {
         console.warn('Unexpected response format:', payload);
         newsletterData = [];
       }
      
      setNewsletters(newsletterData);
      console.log('Newsletters loaded:', newsletterData.length);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching newsletters:', error);
        setResult({ type: 'error', message: 'Failed to fetch newsletters. Please check if newsletters exist in Content Manager.' });
        setNewsletters([]); // Clear only on real error
      }
    }
  };

  const handleNewsletterSelect = (newsletterId: string | number): void => {
    const idString = newsletterId.toString();
    const newsletter = newsletters.find(n => n.id.toString() === idString);
    if (newsletter) {
      setSelectedNewsletter(idString);
      setSubject(newsletter.subject || '');
      setContent(newsletter.content || '');
    }
  };

  const getStatusBadge = (status: 'draft' | 'scheduled' | 'sent'): { children: string; backgroundColor: string; textColor: string } => {
    switch (status) {
      case 'sent':
        return { children: 'Sent', backgroundColor: 'success100', textColor: 'success600' };
      case 'scheduled':
        return { children: 'Scheduled', backgroundColor: 'warning100', textColor: 'warning600' };
      case 'draft':
      default:
        return { children: 'Draft', backgroundColor: 'neutral100', textColor: 'neutral600' };
    }
  };

  const handleSendTest = async (): Promise<void> => {
    if (!testEmail) {
      setResult({ type: 'error', message: 'Please enter a test email address' });
      return;
    }

    if (!subject || !content) {
      setResult({ type: 'error', message: 'Please fill subject and content' });
      return;
    }

    setLoading(true);
    try {
      // Use the email-news API endpoint which doesn't require authentication
      const response = await post('/api/email-news/send-email', {
        to: testEmail,
        subject: subject,
        htmlContent: `
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject}</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${subject}</h1>
                </div>
                <div class="content">
                  ${content.replace(/\n/g, '<br>')}
                </div>
                <div class="footer">
                  <p>This is a test email sent from your newsletter system.</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
      const successResult: MessageResult = { type: 'success', message: 'Test email sent successfully!', success: true };
      setResult(successResult);
    } catch (error) {
      setResult({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred' });
    }
    setLoading(false);
  };

  const handleSendToAll = async (): Promise<void> => {
    if (!subject || !content) {
      setResult({ type: 'error', message: 'Please fill subject and content' });
      return;
    }

    setLoading(true);
    try {
      // Use the email-news API endpoint to send to all subscribers
      const response = await post('/api/email-news/send-newsletter', {
        subject: subject,
        htmlContent: `
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject}</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${subject}</h1>
                </div>
                <div class="content">
                  ${content.replace(/\n/g, '<br>')}
                </div>
                <div class="footer">
                  <p>You received this email because you subscribed to our newsletter.</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
      const successResult: MessageResult = { type: 'success', message: 'Newsletter sent successfully!', success: true };
      setResult(successResult);
      
      // Update newsletter status to 'sent' if successful
      if (selectedNewsletter) {
        await updateNewsletterStatus(selectedNewsletter, 'sent');
        fetchNewsletters(); // Refresh the list
      }
    } catch (error) {
      setResult({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred' });
    }
    setLoading(false);
  };

  const updateNewsletterStatus = async (newsletterId: string, status: 'draft' | 'scheduled' | 'sent'): Promise<void> => {
    try {
      await post(`/content-manager/collection-types/api::newsletter.newsletter/${newsletterId}`, {
        data: {
          docstatus: status,
          sentAt: status === 'sent' ? new Date().toISOString() : null
        }
      });
    } catch (error) {
      console.error('Error updating newsletter status:', error);
    }
  };

  return (
    <Main>
      <Box padding={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="alpha" marginBottom={2}>
              Newsletter Management
            </Typography>
            <Typography variant="omega" textColor="neutral600">
              Send newsletters to your subscribers and track status
            </Typography>
          </Box>
          <Button
            onClick={fetchNewsletters}
            startIcon={<ArrowClockwise />}
            variant="tertiary"
          >
            Refresh
          </Button>
        </Flex>
      </Box>
      
      {result && (
        <Box padding={4}>
          <Alert
            title={result.type === 'success' ? 'Success' : 'Error'}
            variant={result.type === 'success' ? 'success' : 'danger'}
            onClose={() => setResult(null)}
            closeLabel="Close"
          >
            {result.message}
          </Alert>
        </Box>
      )}

      <Box padding={4}>
        <Flex marginBottom={4}>
          <Button 
            variant={activeTab === 0 ? 'default' : 'tertiary'}
            onClick={() => setActiveTab(0)}
            marginRight={2}
          >
            Send Newsletter
          </Button>
          <Button 
            variant={activeTab === 1 ? 'default' : 'tertiary'}
            onClick={() => setActiveTab(1)}
          >
            Newsletter Status
          </Button>
        </Flex>
        
        {activeTab === 0 && (
        <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
          <Box marginBottom={4}>
            <Field.Root name="newsletter">
              <Field.Label>Select Newsletter</Field.Label>
              <SingleSelect
                placeholder="Choose a newsletter to send"
                value={selectedNewsletter}
                onChange={handleNewsletterSelect}
              >
                {Array.isArray(newsletters) && newsletters.map((newsletter) => (
                  <SingleSelectOption key={newsletter.id} value={newsletter.id.toString()}>
                    {newsletter.title || 'Untitled'} - {newsletter.subject || 'No Subject'}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
              <Field.Error />
              <Field.Hint />
            </Field.Root>
          </Box>

          <Field.Root name="subject" required>
                  <Field.Label>Subject</Field.Label>
                  <TextInput
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Newsletter subject"
                  />
                  <Field.Error />
                  <Field.Hint />
                </Field.Root>
                
                <Box marginTop={4}>
                  <Field.Root name="content" required>
                    <Field.Label>Content Preview</Field.Label>
                    <Textarea
                      name="content"
                      value={typeof content === 'string' ? content : JSON.stringify(content)}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Newsletter content (HTML supported)"
                      rows={8}
                    />
                    <Field.Error />
                    <Field.Hint />
                  </Field.Root>
                </Box>

                <Box marginTop={4}>
                  <Typography variant="beta" marginBottom={2}>
                    Test Email
                  </Typography>
                  <Flex gap={2}>
                    <TextInput
                      name="testEmail"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      style={{ flex: 1 }}
                    />
                    <Button
                      onClick={handleSendTest}
                      loading={loading}
                      startIcon={<Play />}
                      variant="secondary"
                      disabled={!subject || !content}
                    >
                      Send Test
                    </Button>
                  </Flex>
                </Box>

                <Box marginTop={4}>
                   <Button
                     onClick={handleSendToAll}
                     loading={loading}
                     startIcon={<Mail />}
                     variant="default"
                     size="L"
                     fullWidth
                     disabled={!selectedNewsletter}
                   >
                     Send to All Subscribers
                   </Button>
                 </Box>
              </Box>
        )}
        
        {activeTab === 1 && (
              <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
                <Typography variant="beta" marginBottom={4}>
                  Newsletter Status Overview
                </Typography>
                
                {newsletters.length > 0 ? (
                  <Table colCount={5} rowCount={newsletters.length + 1}>
                    <Thead>
                      <Tr>
                        <Th>
                          <Typography variant="sigma">Title</Typography>
                        </Th>
                        <Th>
                          <Typography variant="sigma">Subject</Typography>
                        </Th>
                        <Th>
                          <Typography variant="sigma">Status</Typography>
                        </Th>
                        <Th>
                          <Typography variant="sigma">Created</Typography>
                        </Th>
                        <Th>
                          <Typography variant="sigma">Sent At</Typography>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Array.isArray(newsletters) && newsletters.map((newsletter) => (
                        <Tr key={newsletter.id}>
                          <Td>
                            <Typography textColor="neutral800">
                              {newsletter.title || 'Untitled'}
                            </Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {newsletter.subject || 'No Subject'}
                            </Typography>
                          </Td>
                          <Td>
                            <Badge {...getStatusBadge(newsletter.docstatus || 'draft')} />
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {newsletter.createdAt 
                                ? new Date(newsletter.createdAt).toLocaleDateString()
                                : '-'
                              }
                            </Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {newsletter.sentAt 
                                ? new Date(newsletter.sentAt).toLocaleDateString()
                                : '-'
                              }
                            </Typography>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Box textAlign="center" padding={8}>
                    <Typography variant="omega" textColor="neutral500">
                      No newsletters found. Create newsletters in the Content Manager first.
                    </Typography>
                  </Box>
                )}  
               </Box>
        )}
      </Box>
    </Main>
  );
};

export default NewsletterApp;