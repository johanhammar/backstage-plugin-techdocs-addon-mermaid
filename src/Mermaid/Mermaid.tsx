/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';
import mermaid from 'mermaid'
import { isMermaidCode } from './hooks';
import mermaidAPI from 'mermaid/mermaidAPI';


/**
 * Show report issue button when text is highlighted
 */

let diagramId = 0

export const MermaidAddon = (properties: mermaidAPI.Config) => {
  const highlightTables = useShadowRootElements<HTMLDivElement>(['.highlighttable']);

  useEffect(() => {
    highlightTables.forEach(highlightTable => {
      // Mermaid is currently classified as "text"
      // https://github.com/backstage/backstage/pull/11447 which adds this class isn't
      // shipped yet.
      // if (!highlightTable.classList.contains('language-text')) {
      //   return;
      // }

      // Skip already processed
      if (highlightTable.style.display === 'none') {
        return
      }

      const codeBlock = highlightTable.querySelector('code')
      if (!codeBlock) {
        return
      }

      const diagramText = codeBlock.innerText

      // Ideally we could detect mermaid based on some annotation, but use a regex for now
      if (!isMermaidCode(diagramText)) {
        return
      }

      highlightTable.style.display = 'none'

      const diagramElement = document.createElement('div')
      diagramElement.className = "mermaid"

      highlightTable.parentNode?.insertBefore(diagramElement, highlightTable.nextSibling);

      const id = `mermaid-${diagramId++}`

      if (properties) {
        mermaid.initialize(properties);
      }
      mermaid.render(id, diagramText, (svgGraph: string) => {
        diagramElement.innerHTML = svgGraph
      });
    });
  }, [highlightTables, properties]);

  return null;
};
