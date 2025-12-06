// src/webparts/pollinationsImageLab/components/PollinationsImageLab.tsx

import * as React from 'react';
import { useState } from 'react';
import styles from './PollinationsImageLab.module.scss';
import { IPollinationsImageLabProps } from './IPollinationsImageLabProps';

type Theme = 'Teal' | 'Lilac' | 'Dark';

const PROMPTS: string[] = [
  'A serene mountain landscape at sunrise with low mist and golden light',
  'A cozy cabin in a snowy forest at night, warm light glowing from the windows',
  'A futuristic city skyline with neon lights reflecting on rain-soaked streets',
  'A starry night sky over a calm lake, with the Milky Way clearly visible',
  'An ancient library filled with floating books and glowing runes, magical atmosphere',
  'A Pixar-style robot watering flowers on a tiny floating island in the sky',
  'A peaceful Japanese garden with a red bridge, koi pond, and cherry blossoms',
  'A dramatic thunderstorm over a sunflower field, cinematic lighting and contrast',
  'A whimsical treehouse village built in giant redwood trees, lanterns glowing at dusk',
  'An astronaut standing on an alien world, looking at a huge ringed planet in the sky',
  'A vibrant coral reef teeming with colorful fish and marine life, sun rays penetrating the water',
  'A fantasy castle perched on a cliff overlooking a vast ocean, sunset lighting',
  'A close-up portrait of a majestic lion with a flowing mane, golden hour lighting',
  'A bustling medieval marketplace with vendors, townsfolk, and lively activity',
  'A surreal desert landscape with giant floating crystals and a purple sky',
  'A cute puppy playing in a field of wildflowers under a bright blue sky',
  'A steampunk airship flying over a Victorian-era city, detailed and intricate design',
  'A magical forest clearing with glowing mushrooms and fairies dancing',
  'Majestic sunrise over a crystal-clear mountain lake, vibrant sky reflections, ultra-realistic colors, serene and inspiring.',
  'Desert dunes at twilight with long shadows, glowing horizon, dramatic clouds, cinematic mood.',
  'Van Gogh–inspired starry night over a quiet European village, swirling vibrant skies, painterly textures.',
  'Studio Ghibli–style cozy cottage in a meadow, magical lighting, whimsical atmosphere.',
  'Futuristic city skyline with floating skybridges, neon reflections in rain-soaked streets, cyberpunk aesthetic.',
  'A lone astronaut standing on an alien cliffside overlooking bioluminescent forests, surreal colors.',
  'A single bright red cardinal perched on a snowy branch, soft bokeh background, peaceful winter mood.',
  'A candlelit wooden desk with an open journal, handwritten notes, warm cozy glow, nostalgic atmosphere.'
];

const PollinationsImageLab: React.FC<IPollinationsImageLabProps> = (props) => {
  const [theme, setTheme] = useState<Theme>('Teal');
  const [prompt, setPrompt] = useState<string>('A serene mountain landscape at sunrise');
  const [width, setWidth] = useState<number>(1280);
  const [height, setHeight] = useState<number>(720);
  const [model, setModel] = useState<string>('flux');
  const [status, setStatus] = useState<string>('Ready.');
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onRandomPrompt = (): void => {
    const idx = Math.floor(Math.random() * PROMPTS.length);
    setPrompt(PROMPTS[idx]);
    setStatus('Random prompt suggested. Ready to generate! 🎲');
    setError(null);
  };

  const onGenerate = async (): Promise<void> => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setStatus('Please enter a description for your image.');
      setError('Missing prompt');
      return;
    }

    setIsLoading(true);
    setStatus('Generating image... please wait.');
    setError(null);
    setImageUrl(null);

    try {
      const encodedPrompt = encodeURIComponent(trimmed);
      const cacheBust = Date.now().toString();
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&cacheBust=${cacheBust}`;

      const resp = await fetch(url, { method: 'GET' });

      if (!resp.ok) {
        const msg = `Error from server: HTTP ${resp.status}`;
        setStatus('Error while generating image.');
        setError(msg);
        setIsLoading(false);
        return;
      }

      const blob = await resp.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
      setStatus(`Image generated at ${width}x${height} using model '${model}'.`);
    } catch (e) {
      const msg = `Network error: ${e}`;
      setStatus('Error while generating image.');
      setError(msg as string);
    } finally {
      setIsLoading(false);
    }
  };

  const onConvertClick = (): void => {
    alert(
      'JPG → PNG/ICO conversion is available in the desktop Python version.\n\nIn this SharePoint version, right-click the generated image and choose “Save image as…”.'
    );
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value as Theme;
    setTheme(value);
  };

  const themeClass =
    theme === 'Lilac'
      ? styles.themeLilac
      : theme === 'Dark'
        ? styles.themeDark
        : styles.themeTeal;

  return (
    <div className={`${styles.pollinationsImageLab} ${themeClass}`}>
      <div className={styles.appInner}>
        <div className={styles.headerBar}>
          <div className={styles.headerTitle}>
            <span role="img" aria-label="palette">🎨</span>
            <span>Pollinations.ai Image Lab (SPFx)</span>
          </div>
          <div className={styles.headerRight}>
            <span>Theme:</span>
            <select value={theme} onChange={handleThemeChange}>
              <option value="Teal">Teal</option>
              <option value="Lilac">Lilac</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>

        <div className={styles.shadowFrame}>
          <div className={styles.card}>
            <div className={styles.title}>Pollinations.ai Image Generator</div>
            <div className={styles.subtitle}>
              {props.description || 'Enter a prompt, choose size and model, then generate your AI image.'}
            </div>

            <div className={styles.sectionLabel}>Image Prompt:</div>
            <textarea
              className={styles.promptTextarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
            />

            <div className={styles.optionsRow}>
              <div className={styles.optionGroup}>
                <label>Width</label>
                <input
                  type="number"
                  min={256}
                  max={4096}
                  step={64}
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value || '0', 10))}
                />
              </div>
              <div className={styles.optionGroup}>
                <label>Height</label>
                <input
                  type="number"
                  min={256}
                  max={4096}
                  step={64}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value || '0', 10))}
                />
              </div>
              <div className={styles.optionGroup}>
                <label>Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="flux">flux</option>
                  <option value="turbo">turbo</option>
                  <option value="anime">anime</option>
                  <option value="realistic">realistic</option>
                </select>
              </div>
            </div>

            <div className={styles.buttonsRow}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={onRandomPrompt}
              >
                🎲 Random Prompt
              </button>

              <button
                type="button"
                className={`${styles.btn} ${styles.btnAccent} ${isLoading ? styles.btnDisabled : ''}`}
                disabled={isLoading}
                onClick={onGenerate}
              >
                🎨 {isLoading ? 'Generating…' : 'Generate Image'}
              </button>

              <button
                type="button"
                className={styles.btnSecondary}
                onClick={onConvertClick}
              >
                🪄 Convert JPG → PNG/ICO
              </button>
            </div>

            <div className={styles.statusBar}>{status}</div>
            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.previewSectionTitle}>Image Preview:</div>
            <div className={styles.previewCard}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className={styles.previewImage}
                  alt="Generated by Pollinations.ai"
                />
              ) : (
                <div className={styles.previewPlaceholder}>
                  No image generated yet. Describe something and click “Generate Image”!
                </div>
              )}
            </div>

            <div className={styles.footerHint}>
              Tip: Right-click the image and choose “Save image as…” to download.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollinationsImageLab;