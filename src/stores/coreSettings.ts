import { NodeBadgeMode } from '@/types/nodeSource'
import {
  LinkReleaseTriggerAction,
  LinkReleaseTriggerMode
} from '@/types/searchBoxTypes'
import type { SettingParams } from '@/types/settingTypes'

export const CORE_SETTINGS: SettingParams[] = [
  {
    id: 'Comfy.Validation.Workflows',
    name: 'Validate workflows',
    type: 'boolean',
    defaultValue: true
  },

  {
    id: 'Comfy.NodeSearchBoxImpl',
    category: ['Comfy', 'Node Search Box', 'Implementation'],
    experimental: true,
    name: 'Node search box implementation',
    type: 'combo',
    options: ['default', 'litegraph (legacy)'],
    defaultValue: 'default'
  },
  {
    id: 'Comfy.NodeSearchBoxImpl.LinkReleaseTrigger',
    category: ['Comfy', 'Node Search Box', 'LinkReleaseTrigger'],
    name: 'Trigger on link release',
    type: 'hidden',
    options: Object.values(LinkReleaseTriggerMode),
    defaultValue: LinkReleaseTriggerMode.ALWAYS,
    deprecated: true
  },
  {
    id: 'Comfy.LinkRelease.Action',
    name: 'Action on link release (No modifier)',
    type: 'combo',
    options: Object.values(LinkReleaseTriggerAction),
    defaultValue: LinkReleaseTriggerAction.CONTEXT_MENU
  },
  {
    id: 'Comfy.LinkRelease.ActionShift',
    name: 'Action on link release (Shift)',
    type: 'combo',
    options: Object.values(LinkReleaseTriggerAction),
    defaultValue: LinkReleaseTriggerAction.SEARCH_BOX
  },
  {
    id: 'Comfy.NodeSearchBoxImpl.NodePreview',
    category: ['Comfy', 'Node Search Box', 'NodePreview'],
    name: 'Node preview',
    tooltip: 'Only applies to the default implementation',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.NodeSearchBoxImpl.ShowCategory',
    category: ['Comfy', 'Node Search Box', 'ShowCategory'],
    name: 'Show node category in search results',
    tooltip: 'Only applies to the default implementation',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.NodeSearchBoxImpl.ShowIdName',
    category: ['Comfy', 'Node Search Box', 'ShowIdName'],
    name: 'Show node id name in search results',
    tooltip: 'Only applies to the default implementation',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.NodeSearchBoxImpl.ShowNodeFrequency',
    category: ['Comfy', 'Node Search Box', 'ShowNodeFrequency'],
    name: 'Show node frequency in search results',
    tooltip: 'Only applies to the default implementation',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.Sidebar.Location',
    category: ['Comfy', 'Sidebar', 'Location'],
    name: 'Sidebar location',
    type: 'combo',
    options: ['left', 'right'],
    defaultValue: 'left'
  },
  {
    id: 'Comfy.Sidebar.Size',
    category: ['Comfy', 'Sidebar', 'Size'],
    name: 'Sidebar size',
    type: 'combo',
    options: ['normal', 'small'],
    defaultValue: window.innerWidth < 1600 ? 'small' : 'normal'
  },
  {
    id: 'Comfy.TextareaWidget.FontSize',
    category: ['Comfy', 'Node Widget', 'TextareaWidget', 'FontSize'],
    name: 'Textarea widget font size',
    type: 'slider',
    defaultValue: 10,
    attrs: {
      min: 8,
      max: 24
    }
  },
  {
    id: 'Comfy.TextareaWidget.Spellcheck',
    category: ['Comfy', 'Node Widget', 'TextareaWidget', 'Spellcheck'],
    name: 'Textarea widget spellcheck',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.Workflow.SortNodeIdOnSave',
    name: 'Sort node IDs when saving workflow',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.Graph.CanvasInfo',
    name: 'Show canvas info (fps, etc.)',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.Node.ShowDeprecated',
    name: 'Show deprecated nodes in search',
    tooltip:
      'Deprecated nodes are hidden by default in the UI, but remain functional in existing workflows that use them.',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.Node.ShowExperimental',
    name: 'Show experimental nodes in search',
    tooltip:
      'Experimental nodes are marked as such in the UI and may be subject to significant changes or removal in future versions. Use with caution in production workflows',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.Workflow.ShowMissingNodesWarning',
    name: 'Show missing nodes warning',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.Workflow.ShowMissingModelsWarning',
    name: 'Show missing models warning',
    type: 'boolean',
    defaultValue: false,
    experimental: true
  },
  {
    id: 'Comfy.Graph.ZoomSpeed',
    name: 'Canvas zoom speed',
    type: 'slider',
    defaultValue: 1.1,
    attrs: {
      min: 1.01,
      max: 2.5,
      step: 0.01
    }
  },
  // Bookmarks are stored in the settings store.
  // Bookmarks are in format of category/display_name. e.g. "conditioning/CLIPTextEncode"
  {
    id: 'Comfy.NodeLibrary.Bookmarks',
    name: 'Node library bookmarks with display name (deprecated)',
    type: 'hidden',
    defaultValue: [],
    deprecated: true
  },
  {
    id: 'Comfy.NodeLibrary.Bookmarks.V2',
    name: 'Node library bookmarks v2 with unique name',
    type: 'hidden',
    defaultValue: []
  },
  // Stores mapping from bookmark folder name to its customization.
  {
    id: 'Comfy.NodeLibrary.BookmarksCustomization',
    name: 'Node library bookmarks customization',
    type: 'hidden',
    defaultValue: {}
  },
  // Hidden setting used by the queue for how to fit images
  {
    id: 'Comfy.Queue.ImageFit',
    name: 'Queue image fit',
    type: 'hidden',
    defaultValue: 'cover'
  },
  {
    id: 'Comfy.Workflow.ModelDownload.AllowedSources',
    name: 'Allowed model download sources',
    type: 'hidden',
    defaultValue: ['https://huggingface.co/', 'https://civitai.com/']
  },
  {
    id: 'Comfy.Workflow.ModelDownload.AllowedSuffixes',
    name: 'Allowed model download suffixes',
    type: 'hidden',
    defaultValue: ['.safetensors', '.sft']
  },
  {
    id: 'Comfy.GroupSelectedNodes.Padding',
    name: 'Group selected nodes padding',
    type: 'slider',
    defaultValue: 10,
    attrs: {
      min: 0,
      max: 100
    }
  },
  {
    id: 'Comfy.Node.DoubleClickTitleToEdit',
    name: 'Double click node title to edit',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.Group.DoubleClickTitleToEdit',
    name: 'Double click group title to edit',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.Window.UnloadConfirmation',
    name: 'Show confirmation when closing window',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.TreeExplorer.ItemPadding',
    name: 'Tree explorer item padding',
    type: 'slider',
    defaultValue: 2,
    attrs: {
      min: 0,
      max: 8,
      step: 1
    }
  },
  {
    id: 'Comfy.Locale',
    name: 'Locale',
    type: 'combo',
    options: ['en', 'zh'],
    defaultValue: navigator.language.split('-')[0] || 'en'
  },
  {
    id: 'Comfy.NodeBadge.NodeSourceBadgeMode',
    name: 'Node source badge mode',
    type: 'combo',
    options: Object.values(NodeBadgeMode),
    defaultValue: NodeBadgeMode.HideBuiltIn
  },
  {
    id: 'Comfy.NodeBadge.NodeIdBadgeMode',
    name: 'Node ID badge mode',
    type: 'combo',
    options: [NodeBadgeMode.None, NodeBadgeMode.ShowAll],
    defaultValue: NodeBadgeMode.ShowAll
  },
  {
    id: 'Comfy.NodeBadge.NodeLifeCycleBadgeMode',
    name: 'Node life cycle badge mode',
    type: 'combo',
    options: [NodeBadgeMode.None, NodeBadgeMode.ShowAll],
    defaultValue: NodeBadgeMode.ShowAll
  },
  {
    id: 'Comfy.ConfirmClear',
    category: ['Comfy', 'Workflow', 'ConfirmClear'],
    name: 'Require confirmation when clearing workflow',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.PromptFilename',
    category: ['Comfy', 'Workflow', 'PromptFilename'],
    name: 'Prompt for filename when saving workflow',
    type: 'boolean',
    defaultValue: true
  },
  /**
   * file format for preview
   *
   * format;quality
   *
   * ex)
   * webp;50 -> webp, quality 50
   * jpeg;80 -> rgb, jpeg, quality 80
   *
   * @type {string}
   */
  {
    id: 'Comfy.PreviewFormat',
    category: ['Comfy', 'Node Widget', 'PreviewFormat'],
    name: 'Preview image format',
    tooltip:
      'When displaying a preview in the image widget, convert it to a lightweight image, e.g. webp, jpeg, webp;50, etc.',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'Comfy.DisableSliders',
    category: ['Comfy', 'Node Widget', 'DisableSliders'],
    name: 'Disable node widget sliders',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.DisableFloatRounding',
    category: ['Comfy', 'Node Widget', 'DisableFloatRounding'],
    name: 'Disable default float widget rounding.',
    tooltip:
      '(requires page reload) Cannot disable round when round is set by the node in the backend.',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'Comfy.FloatRoundingPrecision',
    category: ['Comfy', 'Node Widget', 'FloatRoundingPrecision'],
    name: 'Float widget rounding decimal places [0 = auto].',
    tooltip: '(requires page reload)',
    type: 'slider',
    attrs: {
      min: 0,
      max: 6,
      step: 1
    },
    defaultValue: 0
  },
  {
    id: 'Comfy.EnableTooltips',
    category: ['Comfy', 'Node', 'EnableTooltips'],
    name: 'Enable Tooltips',
    type: 'boolean',
    defaultValue: true
  },
  {
    id: 'Comfy.DevMode',
    name: 'Enable dev mode options (API save, etc.)',
    type: 'boolean',
    defaultValue: false,
    onChange: (value) => {
      const element = document.getElementById('comfy-dev-save-api-button')
      if (element) {
        element.style.display = value ? 'flex' : 'none'
      }
    }
  }
]
