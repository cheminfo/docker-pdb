import {
  Button,
  Callout,
  Card,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import type { FormEvent } from 'react';
import { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container settings-page">
      <header>
        <h1>Settings</h1>
        <p>Sign in to access the settings page.</p>
      </header>
      <Card style={{ maxWidth: 360 }}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <FormGroup label="Username" labelFor="settings-username">
            <InputGroup
              id="settings-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </FormGroup>
          <FormGroup label="Password" labelFor="settings-password">
            <InputGroup
              id="settings-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          {error ? (
            <Callout intent="danger" style={{ marginBottom: 16 }}>
              {error}
            </Callout>
          ) : null}
          <Button
            type="submit"
            intent="primary"
            loading={loading}
            fill
            text="Sign in"
          />
        </form>
      </Card>
    </div>
  );
}
