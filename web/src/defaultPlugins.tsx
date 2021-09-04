import DrawablePlugins from './display/Drawable';
import OpenGLPlugins from './display/OpenGL';
import ColorPlugins from './display/Color';
import StdioPlugins from './display/Stdio';
import MusicPlugins from './plugins/music/music';
import CanvasPlugins from './plugins/canvas/canvas';
import { RenderPlugins } from './State';

export const defaultPlugins: RenderPlugins = {
    ...DrawablePlugins,
    ...StdioPlugins,
    ...OpenGLPlugins,
    ...ColorPlugins,
    ...MusicPlugins,
    ...CanvasPlugins,
};
