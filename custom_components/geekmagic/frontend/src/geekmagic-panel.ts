/**
 * GeekMagic Panel - Main entry point
 *
 * Custom panel for configuring GeekMagic displays.
 * Uses Home Assistant's Material Design components.
 */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  PanelInfo,
  Route,
  GeekMagicConfig,
  ViewConfig,
  DeviceConfig,
  WidgetConfig,
} from "./types";

// Debounce helper
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

@customElement("geekmagic-panel")
export class GeekMagicPanel extends LitElement {
  // Props passed by Home Assistant
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route!: Route;
  @property({ attribute: false }) panel!: PanelInfo;

  // Internal state
  @state() private _page: "views" | "devices" | "editor" = "views";
  @state() private _config: GeekMagicConfig | null = null;
  @state() private _views: ViewConfig[] = [];
  @state() private _devices: DeviceConfig[] = [];
  @state() private _editingView: ViewConfig | null = null;
  @state() private _previewImage: string | null = null;
  @state() private _previewLoading = false;
  @state() private _loading = true;
  @state() private _saving = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      --mdc-theme-primary: var(--primary-color);
      --mdc-theme-on-primary: var(--text-primary-color);
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color);
    }

    .header-title {
      font-size: 20px;
      font-weight: 400;
      margin-left: 8px;
    }

    .header-tabs {
      margin-left: auto;
      display: flex;
      gap: 4px;
    }

    .tab-button {
      background: transparent;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .tab-button:hover {
      background: var(--secondary-background-color);
    }

    .tab-button.active {
      color: var(--primary-color);
      background: var(--primary-color-alpha, rgba(3, 169, 244, 0.1));
    }

    .content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background: var(--primary-background-color);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* Views Grid */
    .views-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    ha-card {
      --ha-card-border-radius: 12px;
    }

    .view-card {
      cursor: pointer;
    }

    .view-card:hover {
      --ha-card-background: var(--secondary-background-color);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .card-content {
      padding: 0 16px 16px;
    }

    .card-meta {
      font-size: 14px;
      color: var(--secondary-text-color);
    }

    .add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      border: 2px dashed var(--divider-color);
      border-radius: 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: all 0.2s;
    }

    .add-card:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    /* Editor */
    .editor-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .editor-header ha-textfield {
      flex: 1;
    }

    .editor-form {
      max-width: 800px;
    }

    /* Preview section - above widgets */
    .preview-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }

    .preview-card {
      width: 100%;
      max-width: 300px;
    }

    .preview-card .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }

    .preview-image {
      width: 200px;
      height: 200px;
      border-radius: 8px;
      background: #000;
      object-fit: contain;
    }

    .preview-placeholder {
      width: 200px;
      height: 200px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    /* Form Layout */
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row > * {
      flex: 1;
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 24px 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    /* Slots list - simple responsive grid */
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .slot-card {
      --ha-card-border-radius: 8px;
    }

    .slot-card .card-content {
      padding: 16px;
    }

    .slot-header {
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--primary-text-color);
    }

    /* Tiny position grid */
    .position-grid {
      display: inline-grid;
      gap: 2px;
      margin-right: 12px;
      padding: 4px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .position-grid.cols-2 {
      grid-template-columns: repeat(2, 16px);
    }

    .position-grid.cols-3 {
      grid-template-columns: repeat(3, 16px);
    }

    .position-cell {
      width: 16px;
      height: 16px;
      background: var(--divider-color);
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .position-cell:hover {
      background: var(--primary-color);
      opacity: 0.7;
    }

    .position-cell.active {
      background: var(--primary-color);
    }

    .position-cell.hero-main {
      grid-column: 1 / -1;
      width: auto;
      height: 24px;
    }

    .slot-field {
      margin-bottom: 16px;
    }

    .slot-field:last-child {
      margin-bottom: 0;
    }

    ha-select,
    ha-textfield {
      display: block;
      width: 100%;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    /* Devices */
    .devices-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 800px;
    }

    .device-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .device-name {
      font-size: 16px;
      font-weight: 500;
    }

    .device-status {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
    }

    .device-status.online {
      background: var(--success-color, #4caf50);
      color: white;
    }

    .device-status.offline {
      background: var(--error-color, #f44336);
      color: white;
    }

    .views-checkboxes {
      margin-top: 16px;
    }

    .view-checkbox {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .view-checkbox ha-checkbox {
      margin-right: 8px;
    }

    /* Empty states */
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `;

  protected firstUpdated(): void {
    this._loadData();
  }

  private async _loadData(): Promise<void> {
    this._loading = true;
    try {
      const [configResult, viewsResult, devicesResult] = await Promise.all([
        this.hass.connection.sendMessagePromise<GeekMagicConfig>({
          type: "geekmagic/config",
        }),
        this.hass.connection.sendMessagePromise<{ views: ViewConfig[] }>({
          type: "geekmagic/views/list",
        }),
        this.hass.connection.sendMessagePromise<{ devices: DeviceConfig[] }>({
          type: "geekmagic/devices/list",
        }),
      ]);
      this._config = configResult;
      this._views = viewsResult.views;
      this._devices = devicesResult.devices;
    } catch (err) {
      console.error("Failed to load GeekMagic config:", err);
    } finally {
      this._loading = false;
    }
  }

  private async _createView(): Promise<void> {
    const name = prompt("Enter view name:", "New View");
    if (!name) return;

    try {
      const result = await this.hass.connection.sendMessagePromise<{
        view_id: string;
        view: ViewConfig;
      }>({
        type: "geekmagic/views/create",
        name,
        layout: "grid_2x2",
        theme: "classic",
        widgets: [],
      });
      this._views = [...this._views, result.view];
      this._editView(result.view);
    } catch (err) {
      console.error("Failed to create view:", err);
    }
  }

  private _editView(view: ViewConfig): void {
    this._editingView = { ...view, widgets: [...view.widgets] };
    this._page = "editor";
    this._refreshPreview();
  }

  private async _saveView(): Promise<void> {
    if (!this._editingView) return;

    this._saving = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "geekmagic/views/update",
        view_id: this._editingView.id,
        name: this._editingView.name,
        layout: this._editingView.layout,
        theme: this._editingView.theme,
        widgets: this._editingView.widgets,
      });
      this._views = this._views.map((v) =>
        v.id === this._editingView!.id ? this._editingView! : v
      );
      this._page = "views";
      this._editingView = null;
    } catch (err) {
      console.error("Failed to save view:", err);
    } finally {
      this._saving = false;
    }
  }

  private async _deleteView(view: ViewConfig): Promise<void> {
    if (!confirm(`Delete view "${view.name}"?`)) return;

    try {
      await this.hass.connection.sendMessagePromise({
        type: "geekmagic/views/delete",
        view_id: view.id,
      });
      this._views = this._views.filter((v) => v.id !== view.id);
    } catch (err) {
      console.error("Failed to delete view:", err);
    }
  }

  private _refreshPreview = debounce(async () => {
    if (!this._editingView) return;

    this._previewLoading = true;
    try {
      const result = await this.hass.connection.sendMessagePromise<{
        image: string;
      }>({
        type: "geekmagic/preview/render",
        view_config: {
          layout: this._editingView.layout,
          theme: this._editingView.theme,
          widgets: this._editingView.widgets,
        },
      });
      this._previewImage = result.image;
    } catch (err) {
      console.error("Failed to render preview:", err);
    } finally {
      this._previewLoading = false;
    }
  }, 500);

  private _updateEditingView(updates: Partial<ViewConfig>): void {
    if (!this._editingView) return;
    this._editingView = { ...this._editingView, ...updates };
    this._refreshPreview();
  }

  private _updateWidget(slot: number, updates: Partial<WidgetConfig>): void {
    if (!this._editingView) return;

    const widgets = [...this._editingView.widgets];
    const existingIndex = widgets.findIndex((w) => w.slot === slot);

    if (existingIndex >= 0) {
      widgets[existingIndex] = { ...widgets[existingIndex], ...updates };
    } else {
      widgets.push({ slot, type: "", ...updates });
    }

    // Create new object to ensure Lit detects the change
    this._editingView = { ...this._editingView, widgets: [...widgets] };
    this.requestUpdate();
    this._refreshPreview();
  }

  private async _toggleDeviceView(
    device: DeviceConfig,
    viewId: string,
    enabled: boolean
  ): Promise<void> {
    const newViews = enabled
      ? [...device.assigned_views, viewId]
      : device.assigned_views.filter((v) => v !== viewId);

    try {
      await this.hass.connection.sendMessagePromise({
        type: "geekmagic/devices/assign_views",
        entry_id: device.entry_id,
        view_ids: newViews,
      });
      this._devices = this._devices.map((d) =>
        d.entry_id === device.entry_id ? { ...d, assigned_views: newViews } : d
      );
    } catch (err) {
      console.error("Failed to update device views:", err);
    }
  }

  render() {
    if (this._loading) {
      return html`
        <div class="loading">
          <ha-circular-progress indeterminate></ha-circular-progress>
        </div>
      `;
    }

    return html`
      <div class="header">
        <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        <span class="header-title">GeekMagic</span>
        ${this._page !== "editor"
          ? html`
              <div class="header-tabs">
                <button
                  class="tab-button ${this._page === "views" ? "active" : ""}"
                  @click=${() => (this._page = "views")}
                >
                  Views
                </button>
                <button
                  class="tab-button ${this._page === "devices" ? "active" : ""}"
                  @click=${() => (this._page = "devices")}
                >
                  Devices
                </button>
              </div>
            `
          : nothing}
      </div>
      <div class="content">${this._renderPage()}</div>
    `;
  }

  private _renderPage() {
    switch (this._page) {
      case "views":
        return this._renderViewsList();
      case "devices":
        return this._renderDevicesList();
      case "editor":
        return this._renderEditor();
    }
  }

  private _renderViewsList() {
    return html`
      <div class="views-grid">
        ${this._views.map(
          (view) => html`
            <ha-card class="view-card" @click=${() => this._editView(view)}>
              <div class="card-header">
                <h3>${view.name}</h3>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._deleteView(view);
                  }}
                ></ha-icon-button>
              </div>
              <div class="card-content">
                <div class="card-meta">
                  ${this._config?.layout_types[view.layout]?.name || view.layout}
                  &bull; ${this._config?.themes[view.theme] || view.theme}
                  &bull; ${view.widgets.length} widgets
                </div>
              </div>
            </ha-card>
          `
        )}
        <div class="add-card" @click=${this._createView}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span style="margin-left: 8px">Add View</span>
        </div>
      </div>
    `;
  }

  private _renderDevicesList() {
    if (this._devices.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:monitor-off"></ha-icon>
          <p>No GeekMagic devices configured.</p>
          <p>Add a device through Settings → Devices & Services.</p>
        </div>
      `;
    }

    return html`
      <div class="devices-list">
        ${this._devices.map(
          (device) => html`
            <ha-card>
              <div class="card-content" style="padding-top: 16px;">
                <div class="device-header">
                  <span class="device-name">${device.name}</span>
                  <span class="device-status ${device.online ? "online" : "offline"}">
                    ${device.online ? "Online" : "Offline"}
                  </span>
                </div>
                <div class="views-checkboxes">
                  <div class="section-title" style="margin-top: 8px;">Assigned Views</div>
                  ${this._views.length === 0
                    ? html`<p style="color: var(--secondary-text-color)">
                        No views available. Create a view first.
                      </p>`
                    : this._views.map(
                        (view) => html`
                          <label class="view-checkbox">
                            <ha-checkbox
                              .checked=${device.assigned_views.includes(view.id)}
                              @change=${(e: Event) =>
                                this._toggleDeviceView(
                                  device,
                                  view.id,
                                  (e.target as HTMLInputElement).checked
                                )}
                            ></ha-checkbox>
                            ${view.name}
                          </label>
                        `
                      )}
                </div>
              </div>
            </ha-card>
          `
        )}
      </div>
    `;
  }

  private _renderEditor() {
    if (!this._editingView || !this._config) return nothing;

    const slotCount =
      this._config.layout_types[this._editingView.layout]?.slots || 4;

    return html`
      <div class="editor-header">
        <ha-icon-button
          .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
          @click=${() => (this._page = "views")}
        ></ha-icon-button>
        <ha-textfield
          .value=${this._editingView.name}
          @input=${(e: Event) =>
            this._updateEditingView({
              name: (e.target as HTMLInputElement).value,
            })}
          placeholder="View name"
        ></ha-textfield>
        <ha-button raised ?disabled=${this._saving} @click=${this._saveView}>
          ${this._saving ? "Saving..." : "Save"}
        </ha-button>
      </div>

      <div class="editor-form">
        <!-- Preview at top -->
        <div class="preview-section">
          <ha-card class="preview-card">
            <div class="card-header">
              <h3>Preview</h3>
              <ha-icon-button
                .path=${"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"}
                @click=${() => this._refreshPreview()}
              ></ha-icon-button>
            </div>
            <div class="card-content">
              ${this._previewLoading
                ? html`<div class="preview-placeholder">
                    <ha-circular-progress indeterminate></ha-circular-progress>
                  </div>`
                : this._previewImage
                  ? html`<img
                      class="preview-image"
                      src="data:image/png;base64,${this._previewImage}"
                      alt="Preview"
                    />`
                  : html`<div class="preview-placeholder">No preview</div>`}
            </div>
          </ha-card>
        </div>

        <!-- Layout and theme selectors -->
        <div class="form-row">
          <ha-select
            label="Layout"
            .value=${this._editingView.layout}
            @selected=${(e: CustomEvent) => {
              const index = e.detail.index as number;
              const keys = Object.keys(this._config!.layout_types);
              const value = keys[index];
              if (value) this._updateEditingView({ layout: value });
            }}
            @closed=${(e: Event) => e.stopPropagation()}
          >
            ${Object.entries(this._config.layout_types).map(
              ([key, info]) => html`
                <mwc-list-item value=${key}>
                  ${info.name} (${info.slots} slots)
                </mwc-list-item>
              `
            )}
          </ha-select>
          <ha-select
            label="Theme"
            .value=${this._editingView.theme}
            @selected=${(e: CustomEvent) => {
              const index = e.detail.index as number;
              const keys = Object.keys(this._config!.themes);
              const value = keys[index];
              if (value) this._updateEditingView({ theme: value });
            }}
            @closed=${(e: Event) => e.stopPropagation()}
          >
            ${Object.entries(this._config.themes).map(
              ([key, name]) => html`
                <mwc-list-item value=${key}>${name}</mwc-list-item>
              `
            )}
          </ha-select>
        </div>

        <!-- Widget slots -->
        <div class="section-title">Widgets</div>
        <div class="slots-grid">
          ${Array.from({ length: slotCount }, (_, i) =>
            this._renderSlotEditor(i, slotCount)
          )}
        </div>
      </div>
    `;
  }

  private _renderSlotEditor(slot: number, slotCount: number) {
    if (!this._config || !this._editingView) return nothing;

    const widget = this._editingView.widgets.find((w) => w.slot === slot);
    const widgetType = widget?.type || "";
    const schema = this._config.widget_types[widgetType];
    const layout = this._editingView.layout;

    return html`
      <ha-card class="slot-card">
        <div class="card-content">
          <div class="slot-header">
            ${this._renderPositionGrid(slot, slotCount, layout)}
            <span style="flex: 1;">Slot ${slot + 1}</span>
          </div>

          <div class="slot-field">
            <ha-select
              label="Widget Type"
              .value=${widgetType}
              @selected=${(e: CustomEvent) => {
                const index = e.detail.index as number;
                const keys = ["", ...Object.keys(this._config!.widget_types)];
                const value = keys[index] || "";
                this._updateWidget(slot, { type: value });
              }}
              @closed=${(e: Event) => e.stopPropagation()}
            >
              <mwc-list-item value="">-- Empty --</mwc-list-item>
              ${Object.entries(this._config.widget_types).map(
                ([key, info]) => html`
                  <mwc-list-item value=${key}>${info.name}</mwc-list-item>
                `
              )}
            </ha-select>
          </div>

          ${schema?.needs_entity
            ? html`
                <div class="slot-field">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{
                      entity: schema.entity_domains
                        ? { domain: schema.entity_domains }
                        : {},
                    }}
                    .value=${widget?.entity_id || ""}
                    .label=${"Entity"}
                    @value-changed=${(e: CustomEvent) =>
                      this._updateWidget(slot, {
                        entity_id: e.detail.value,
                      })}
                  ></ha-selector>
                </div>
              `
            : nothing}

          <div class="slot-field">
            <ha-textfield
              label="Label (optional)"
              .value=${widget?.label || ""}
              @input=${(e: Event) =>
                this._updateWidget(slot, {
                  label: (e.target as HTMLInputElement).value,
                })}
            ></ha-textfield>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderPositionGrid(
    currentSlot: number,
    slotCount: number,
    layout: string
  ) {
    // Determine grid dimensions based on layout
    let cols = 2;
    let rows = 2;
    let isHero = false;

    switch (layout) {
      case "grid_2x2":
        cols = 2;
        rows = 2;
        break;
      case "grid_2x3":
        cols = 2;
        rows = 3;
        break;
      case "grid_3x2":
        cols = 3;
        rows = 2;
        break;
      case "hero":
        cols = 3;
        rows = 2;
        isHero = true;
        break;
      case "split":
        cols = 2;
        rows = 1;
        break;
      case "three_column":
        cols = 3;
        rows = 1;
        break;
      default:
        cols = 2;
        rows = Math.ceil(slotCount / 2);
    }

    // Generate grid cells
    const cells = [];

    if (isHero) {
      // Hero layout: slot 0 is the big hero, slots 1-3 are footer
      cells.push(html`
        <div
          class="position-cell hero-main ${currentSlot === 0 ? "active" : ""}"
          @click=${() => this._swapSlots(currentSlot, 0)}
          title="Hero (main)"
        ></div>
      `);
      for (let i = 1; i <= 3; i++) {
        cells.push(html`
          <div
            class="position-cell ${currentSlot === i ? "active" : ""}"
            @click=${() => this._swapSlots(currentSlot, i)}
            title="Footer ${i}"
          ></div>
        `);
      }
    } else {
      for (let i = 0; i < slotCount; i++) {
        cells.push(html`
          <div
            class="position-cell ${currentSlot === i ? "active" : ""}"
            @click=${() => this._swapSlots(currentSlot, i)}
            title="Slot ${i + 1}"
          ></div>
        `);
      }
    }

    return html`
      <div class="position-grid cols-${cols}">${cells}</div>
    `;
  }

  private _swapSlots(fromSlot: number, toSlot: number): void {
    if (fromSlot === toSlot || !this._editingView) return;

    const widgets = [...this._editingView.widgets];
    const fromWidget = widgets.find((w) => w.slot === fromSlot);
    const toWidget = widgets.find((w) => w.slot === toSlot);

    // Swap slot assignments
    if (fromWidget) fromWidget.slot = toSlot;
    if (toWidget) toWidget.slot = fromSlot;

    this._editingView = { ...this._editingView, widgets: [...widgets] };
    this.requestUpdate();
    this._refreshPreview();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "geekmagic-panel": GeekMagicPanel;
  }
}
