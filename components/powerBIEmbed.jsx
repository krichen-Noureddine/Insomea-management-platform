// components/PowerBIEmbed.jsx
import { useEffect, useRef } from 'react';

const PowerBIEmbed = ({ reportId, embedUrl, accessToken }) => {
  const embedContainer = useRef(null);

  useEffect(() => {
    const loadPowerBI = async () => {
      console.log('Running loadPowerBI with:', { reportId, embedUrl, accessToken });

      if (!embedContainer.current) {
        console.error('Embed container is not available');
        return;
      }

      if (!embedUrl || !reportId || !accessToken) {
        console.error('One or more required parameters are not available', { embedUrl, reportId, accessToken });
        return;
      }

      try {
        const powerbiClient = await import('powerbi-client');
        const { models, factories, service } = powerbiClient;

        if (!models || !service) {
          console.error('Failed to load Power BI client models or service');
          return;
        }

        const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

        const config = {
          type: 'report',
          id: reportId,
          embedUrl: embedUrl,
          accessToken: accessToken,
          tokenType: models.TokenType.Embed,
          permissions: models.Permissions.All,
          settings: {
            panes: {
              filters: {
                visible: false,
              },
              pageNavigation: {
                visible: false,
              },
            },
          },
        };

        console.log('Creating Power BI embed instance with config:', config);
        const embeddedReport = powerbi.embed(embedContainer.current, config);
        console.log('Power BI report loaded successfully:', { reportId, embedUrl });

        return () => {
          powerbi.reset(embedContainer.current);
        };
      } catch (error) {
        console.error('Error loading Power BI report:', error);
      }
    };

    loadPowerBI();
  }, [reportId, embedUrl, accessToken]);

  return <div ref={embedContainer} style={{ height: '541.25px', width: '1140px' }}></div>;
};

export default PowerBIEmbed;
