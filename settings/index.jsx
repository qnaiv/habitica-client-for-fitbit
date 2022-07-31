
registerSettingsPage(({ settings,props }) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
          Habitica Id/Token
        </Text>
      }
    >
      <TextInput 
      label="User ID" 
      settingsKey="userId"
      placeholder="Input user id."
      />
      <TextInput 
      label="Token" 
      settingsKey="token"
      placeholder="Input user token."
      />
    </Section>
  </Page>
));