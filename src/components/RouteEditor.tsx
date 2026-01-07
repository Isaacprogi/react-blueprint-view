// visualizer/RouteEditor.tsx
import React, { useState } from "react";
import type { VisualRouteNode } from "../../utils/type";
import "../../styles/RouteVisualizer.css";

type Props = {
  node: VisualRouteNode;
  onUpdate: (updatedNode: VisualRouteNode) => void;
};

export const RouteEditor: React.FC<Props> = ({ node, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editedNode, setEditedNode] = useState({ ...node });


  const handleChange = (field: keyof VisualRouteNode, value: any) => {
    setEditedNode(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRolesChange = (roles: string) => {
    const rolesArray = roles.split(',').map(r => r.trim()).filter(r => r);
    handleChange('roles', rolesArray);
  };

  const renderField = (label: string, value: any, field?: keyof VisualRouteNode) => {
    if (editing && field) {
      const inputProps = {
        value: value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
          handleChange(field, e.target.value),
        className: "editor-input"
      };

      if (field === 'type') {
        return (
          <select {...inputProps}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="neutral">Neutral</option>
          </select>
        );
      }

      if (field === 'lazy') {
        return (
          <select
            value={value ? 'true' : 'false'}
            onChange={(e) => handleChange(field, e.target.value === 'true')}
            className="editor-input"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }

      if (field === 'roles') {
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => handleRolesChange(e.target.value)}
            className="editor-input"
            placeholder="admin, user, guest (comma separated)"
          />
        );
      }

      return <input type="text" {...inputProps} />;
    }

    return <span className="field-value">{Array.isArray(value) ? value.join(', ') : String(value)}</span>;
  };

  const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="property-section">
      <h4>{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="route-editor">
      
      <div className="editor-header">
        <h3>
          {node.index ? 'Index Route' : node.path || 'Root'}
          <span className="editor-subtitle">Route Details</span>
        </h3>
        {/* <div className="editor-controls">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="edit-btn">
              ✏️ Edit
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="save-btn">
                💾 Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                ❌ Cancel
              </button>
            </>
          )}
        </div> */}
      </div>

      <div className="editor-content">
        <PropertySection title="Basic Information">
          <div className="property-row">
            <label>Path:</label>
            {renderField('Path', node.path, 'path')}
          </div>
          <div className="property-row">
            <label>Full Path:</label>
            <span className="field-value">{node.fullPath}</span>
          </div>
          <div className="property-row">
            <label>Type:</label>
            {renderField('Type', node.type, 'type')}
          </div>
          <div className="property-row">
            <label>Index Route:</label>
            <span className="field-value">{node.index ? 'Yes' : 'No'}</span>
          </div>
        </PropertySection>

        <PropertySection title="Access Control">
          <div className="property-row">
            <label>Route Roles:</label>
            {renderField('Roles', node.roles, 'roles')}
          </div>
          <div className="property-row">
            <label>Allowed Roles:</label>
            <span className="field-value">
              {node.inheritedRoles.length > 0 ? node.inheritedRoles.join(', ') : 'None'}
            </span>
          </div>
        </PropertySection>

        <PropertySection title="Behavior">
          <div className="property-row">
            <label>Lazy Loaded:</label>
            {renderField('Lazy', node.lazy, 'lazy')}
          </div>
          <div className="property-row">
            <label>Redirect To:</label>
            {renderField('Redirect To', node.redirectTo || 'None', 'redirectTo')}
          </div>
        </PropertySection>

        <PropertySection title="Children">
          <div className="property-row">
            <label>Children Count:</label>
            <span className="field-value">{node.children.length}</span>
          </div>
          {node.children.length > 0 && (
            <div className="children-list">
              <h5>Child Routes:</h5>
              <ul>
                {node.children.map(child => (
                  <li key={child.id}>
                    <span className="child-path">{child.path || '(index)'}</span>
                    <span className={`child-type ${child.type}`}>{child.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PropertySection>

        <PropertySection title="Metadata">
          <div className="property-row">
            <label>Node ID:</label>
            <span className="field-value monospace">{node.id}</span>
          </div>
        </PropertySection>
      </div>
    </div>
  );
};