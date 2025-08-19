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
} from '@strapi/design-system';
import { Mail, Play, ArrowClockwise } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';

const NewsletterApp = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const { get, post } = useFetchClient();

  // Fetch newsletters on component mount
  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const { data } = await get('/admin/api/newsletters?populate=*');
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      setResult({ type: 'error', message: 'Failed to fetch newsletters' });
    }
  };

  const handleNewsletterSelect = (newsletterId) => {
    const newsletter = newsletters.find(n => n.id === parseInt(newsletterId));
    if (newsletter) {
      setSelectedNewsletter(newsletterId);
      setSubject(newsletter.attributes?.subject || newsletter.subject || '');
      setContent(newsletter.attributes?.content || newsletter.content || '');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return { children: 'Sent', backgroundColor: 'success100', textColor: 'success600' };
      case 'draft':
        return { children: 'Draft', backgroundColor: 'neutral100', textColor: 'neutral600' };
      case 'scheduled':
        return { children: 'Scheduled', backgroundColor: 'warning100', textColor: 'warning600' };
      default:
        return { children: 'Unknown', backgroundColor: 'neutral100', textColor: 'neutral600' };
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !subject || !content) {
      setResult({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      if (!selectedNewsletter) {
        setResult({ type: 'error', message: 'Please select a newsletter first' });
        return;
      }

      const data = await post(`/api/newsletters/${selectedNewsletter}/send-test`, {
        testEmail: testEmail
      });
      setResult(data);
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const handleSendToAll = async () => {
    if (!subject || !content) {
      setResult({ type: 'error', message: 'Please fill subject and content' });
      return;
    }

    setLoading(true);
    try {
      if (!selectedNewsletter) {
        setResult({ type: 'error', message: 'Please select a newsletter first' });
        return;
      }

      const data = await post(`/api/newsletters/${selectedNewsletter}/send`, {
        subject,
        content,
      });
      setResult(data);
      
      // Update newsletter status to 'sent' if successful
      if (data.success && selectedNewsletter) {
        await updateNewsletterStatus(selectedNewsletter, 'sent');
        fetchNewsletters(); // Refresh the list
      }
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const updateNewsletterStatus = async (newsletterId, status) => {
    try {
      await post(`/content-manager/collection-types/api::newsletter.newsletter/${newsletterId}`, {
        docstatus: status,
        sentAt: status === 'sent' ? new Date().toISOString() : null,
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
            title={result.success ? 'Success' : 'Error'}
            variant={result.success ? 'success' : 'danger'}
            onClose={() => setResult(null)}
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
                   <SingleSelect
                     label="Select Newsletter"
                     placeholder="Choose a newsletter to send"
                     value={selectedNewsletter}
                     onChange={handleNewsletterSelect}
                   >
                     {newsletters.map((newsletter) => (
                       <SingleSelectOption key={newsletter.id} value={newsletter.id.toString()}>
                         {newsletter.attributes?.title || newsletter.title || 'Untitled'} - {newsletter.attributes?.subject || newsletter.subject || 'No Subject'}
                       </SingleSelectOption>
                     ))}
                   </SingleSelect>
                 </Box>

                <TextInput
                  label="Subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Newsletter subject"
                  required
                />
                
                <Box marginTop={4}>
                  <Textarea
                    label="Content Preview"
                    name="content"
                    value={typeof content === 'string' ? content : JSON.stringify(content)}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Newsletter content (HTML supported)"
                    rows={8}
                    required
                  />
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
                      disabled={!selectedNewsletter}
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
                      {newsletters.map((newsletter) => (
                        <Tr key={newsletter.id}>
                          <Td>
                            <Typography textColor="neutral800">
                              {newsletter.attributes?.title || newsletter.title || 'Untitled'}
                            </Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {newsletter.attributes?.subject || newsletter.subject || 'No Subject'}
                            </Typography>
                          </Td>
                          <Td>
                            <Badge {...getStatusBadge(newsletter.attributes?.docstatus || newsletter.docstatus || 'draft')} />
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {(newsletter.attributes?.createdAt || newsletter.createdAt) 
                                ? new Date(newsletter.attributes?.createdAt || newsletter.createdAt).toLocaleDateString()
                                : '-'
                              }
                            </Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral600">
                              {(newsletter.attributes?.sentAt || newsletter.sentAt) 
                                ? new Date(newsletter.attributes?.sentAt || newsletter.sentAt).toLocaleDateString()
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