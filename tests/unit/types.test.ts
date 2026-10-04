import { describe, expect, it } from 'vitest';

import {
  beautyProfileSchema,
  getMessageDisplayText,
  getMessageFileParts,
  isLegacyMessage,
  type LegacyMessage,
  loginSchema,
  serializeUIMessageForClient,
  signUpFormSchema,
  toUIMessage,
  transformLegacyMessageToUIMessage,
} from '@/lib/types';

describe('auth schemas', () => {
  it('accepts a valid signup payload', () => {
    const result = signUpFormSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid signup payloads', () => {
    expect(signUpFormSchema.safeParse({}).success).toBe(false);
    expect(
      signUpFormSchema.safeParse({
        firstName: '',
        lastName: 'Doe',
        email: 'not-an-email',
        password: '123',
      }).success,
    ).toBe(false);
  });

  it('validates login payloads', () => {
    expect(
      loginSchema.safeParse({ email: 'jane@example.com', password: 'password123' }).success,
    ).toBe(true);
    expect(loginSchema.safeParse({ email: 'bad', password: '123' }).success).toBe(false);
  });

  it('requires hairColor and skinColor on beauty profiles', () => {
    const base = {
      hairColor: 'Black',
      hairType: '4c',
      strandThickness: 'Coarse',
      chemicalTreatment: 'None',
      hairVolume: 'Thick',
      skinColor: 'Dark Brown',
      skinType: 'Oily',
      sensitivity: 'Not sensitive',
      albino: 'No',
    };
    expect(beautyProfileSchema.safeParse(base).success).toBe(true);
    expect(beautyProfileSchema.safeParse({ ...base, hairColor: '' }).success).toBe(false);
    expect(beautyProfileSchema.safeParse({ ...base, skinColor: '' }).success).toBe(false);
  });
});

describe('message helpers', () => {
  const legacy: LegacyMessage = {
    id: 'legacy-1',
    role: 'user',
    content: 'Hello **world**',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  it('detects legacy messages', () => {
    expect(isLegacyMessage(legacy)).toBe(true);
    expect(
      isLegacyMessage({ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'hi' }] } as never),
    ).toBe(false);
  });

  it('transforms legacy messages including attachments', () => {
    const withAttachments: LegacyMessage = {
      ...legacy,
      _id: 'mongo-id',
      experimental_attachments: [
        { url: 'https://cdn.example/img.png', name: 'img.png', contentType: 'image/png' },
      ],
    };
    const ui = transformLegacyMessageToUIMessage(withAttachments);
    expect(ui.id).toBe('mongo-id');
    expect(ui.role).toBe('user');
    expect(ui.parts[0]).toMatchObject({ type: 'text', text: 'Hello **world**' });
    expect(ui.parts[1]).toMatchObject({
      type: 'file',
      url: 'https://cdn.example/img.png',
      filename: 'img.png',
      mediaType: 'image/png',
    });
  });

  it('passes UIMessages through toUIMessage unchanged', () => {
    const ui = {
      id: 'm1',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hi' }],
    } as never;
    expect(toUIMessage(ui)).toBe(ui);
    expect(toUIMessage(legacy).parts[0]).toMatchObject({ type: 'text' });
  });

  it('extracts display text with legacy and v6 shapes', () => {
    expect(getMessageDisplayText(legacy)).toBe('Hello **world**');
    expect(
      getMessageDisplayText({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'Answer' }],
      } as never),
    ).toBe('Answer');
    expect(getMessageDisplayText({ id: 'm1', role: 'assistant', parts: [] } as never)).toBe('');
  });

  it('extracts file parts only', () => {
    const files = getMessageFileParts({
      id: 'm1',
      role: 'user',
      parts: [
        { type: 'text', text: 'see attached' },
        { type: 'file', url: 'https://cdn.example/a.png', mediaType: 'image/png' },
      ],
    } as never);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatchObject({ type: 'file' });
  });

  it('serializes Dates, ObjectIds and bigints for the client', () => {
    const message = {
      id: 'm1',
      role: 'user',
      parts: [{ type: 'text', text: 'hi' }],
      metadata: {
        createdAt: new Date('2024-05-01T00:00:00.000Z'),
        objectId: { _bsontype: 'ObjectId', toHexString: () => 'abc123' },
        big: BigInt(10),
        nested: [{ when: new Date('2024-05-02T00:00:00.000Z') }],
      },
    } as never;
    const serialized = serializeUIMessageForClient(message) as unknown as Record<string, never>;
    const metadata = serialized.metadata as Record<string, unknown>;
    expect(metadata.createdAt).toBe('2024-05-01T00:00:00.000Z');
    expect(metadata.objectId).toBe('abc123');
    expect(metadata.big).toBe('10');
    expect((metadata.nested as { when: string }[])[0].when).toBe('2024-05-02T00:00:00.000Z');
  });
});
