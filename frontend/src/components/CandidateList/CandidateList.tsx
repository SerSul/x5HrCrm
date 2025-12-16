import { useEffect, useState } from 'react';
import {
  Button,
  Table,
  withTableSettings,
  Flex,
  Spin,
  type TableSettingsData,
} from '@gravity-ui/uikit';
// import { useNavigate } from 'react-router';
import { useCandidateStore } from '../../storage/candidateStorage';

import styles from './CandidateList.module.scss';

const MyTable = withTableSettings(Table);

const data = [
  { id: 1, text: 'Hello' },
  { id: 2, text: 'World' },
];
const columns = [{ id: 'id' }, { id: 'text' }];

const CandidateList = () => {
  const { candidates, loading, error, fetchCandidates } = useCandidateStore();
  // const navigate = useNavigate();

  const [settings, setSettings] = useState<TableSettingsData>([
    { id: 'id', isSelected: false },
    { id: 'text', isSelected: true },
  ]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Candidates</h2>
      {candidates.length === 0 ? (
        <p>No candidates available</p>
      ) : (
        <div className={styles.candidateList}>
          <MyTable
            data={data}
            columns={columns}
            settings={settings}
            updateSettings={(settings) => {
              setSettings(settings);
              return Promise.resolve();
            }}
            renderControls={({ DefaultApplyButton, onApply }) => (
              <Flex gapRow="1" direction="column">
                <Button
                  view="outlined-warning"
                  onClick={() => {
                    onApply();
                    setSettings([
                      { id: 'id', isSelected: false },
                      { id: 'text', isSelected: true },
                    ]);
                  }}
                >
                  Reset
                </Button>
                <DefaultApplyButton />
              </Flex>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateList;
